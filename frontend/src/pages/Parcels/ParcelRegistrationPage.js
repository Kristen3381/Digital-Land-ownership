import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'; // If using Zod
import * as z from 'zod'; // Import Zod
import { useNotification } from '../../contexts/NotificationContext';
import { createParcel } from '../../services/parcelService';
import useGeolocation from '../../hooks/useGeolocation'; // NEW: GPS hook
import MapDisplay from '../../components/MapDisplay/MapDisplay'; // For map interaction
import Button from '../../components/Button/Button';
import styles from './ParcelForm.module.css'; // Page-specific styling

// Frontend validation schema (mirrors backend, but client-side)
const parcelSchema = z.object({
  parcelId: z.string().min(3, "Parcel ID must be at least 3 characters").max(20).trim().toUpperCase(),
  ownerName: z.string().min(3, "Owner name is required"),
  idNumber: z.string().min(5, "ID Number is required"),
  contact: z.string().min(10, "Contact is required").max(15).optional(),
  address: z.string().optional(),
  // geometry will be handled separately as a complex object/map interaction
  // documents will be handled separately as files
});

function ParcelRegistrationPage() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(parcelSchema),
  });
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Ref for file input

  const { location, error: geoError, loading: geoLoading, getCurrentLocation } = useGeolocation(); // GPS hook

  // State to hold GeoJSON geometry from map interaction
  const [geometry, setGeometry] = useState(null); // GeoJSON Polygon object
  const [mapCenter, setMapCenter] = useState([-0.076, 34.78]); // Default Kakamega center
  const [mapZoom, setMapZoom] = useState(12);

  // Example: How to update geometry from map clicks (simplified)
  // In a real app, you'd integrate a drawing tool like leaflet-draw
  const handleMapClick = (e) => {
    // For simplicity, let's just create a tiny square polygon around the click point
    const { lat, lng } = e.latlng;
    const buffer = 0.0001; // Small buffer for a tiny square
    const newGeometry = {
      type: "Polygon",
      coordinates: [[
        [lng - buffer, lat - buffer],
        [lng + buffer, lat - buffer],
        [lng + buffer, lat + buffer],
        [lng - buffer, lat + buffer],
        [lng - buffer, lat - buffer] // Closing point
      ]]
    };
    setGeometry(newGeometry);
    showNotification(`Polygon drawn at ${lat.toFixed(4)}, ${lng.toFixed(4)}`, 'info');
  };

  const handleGetLocation = () => {
    getCurrentLocation(); // Activates GPS
    if (location) {
      setMapCenter([location.latitude, location.longitude]); // Center map on GPS location
      setMapZoom(18); // Zoom in closer
      showNotification(`GPS acquired! Lat: ${location.latitude.toFixed(5)}, Lon: ${location.longitude.toFixed(5)}`, 'success');
    } else if (geoError) {
      showNotification(`GPS Error: ${geoError}`, 'error');
    }
  };

  const onSubmit = async (data) => {
    if (!geometry) {
      showNotification('Please draw or select a parcel geometry on the map.', 'error');
      return;
    }

    const files = fileInputRef.current?.files;
    if (!files || files.length === 0) {
      showNotification('Please upload at least one document.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('parcelId', data.parcelId);

    // Stringify ownerDetails and geometry before appending to FormData
    formData.append('ownerDetails', JSON.stringify({
      ownerName: data.ownerName,
      idNumber: data.idNumber,
      contact: data.contact,
      address: data.address,
    }));
    formData.append('geometry', JSON.stringify(geometry));

    // Append documents
    for (let i = 0; i < files.length; i++) {
      formData.append('documents', files[i]); // Field name 'documents' as expected by backend
    }

    try {
      await createParcel(formData); // API call to backend
      showNotification('Land parcel registered successfully!', 'success');
      navigate('/parcels'); // Redirect to parcel list
    } catch (error) {
      console.error('Parcel registration failed:', error);
      showNotification(error.response?.data?.message || error.response?.data?.msg || 'Failed to register parcel.', 'error');
    }
  };

  return (
    <div className={styles.parcelFormContainer}>
      <h2 className={styles.title}>Register a New Parcel</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.parcelForm}>
        <div className={styles.formSection}>
          <h3>Parcel Details</h3>
          <div className={styles.formGroup}>
            <label htmlFor="parcelId">Parcel ID:</label>
            <input type="text" id="parcelId" {...register('parcelId')} />
            {errors.parcelId && <p className={styles.errorText}>{errors.parcelId.message}</p>}
          </div>
        </div>

        <div className={styles.formSection}>
          <h3>Owner Information</h3>
          <div className={styles.formGroup}>
            <label htmlFor="ownerName">Owner Name:</label>
            <input type="text" id="ownerName" {...register('ownerName')} />
            {errors.ownerName && <p className={styles.errorText}>{errors.ownerName.message}</p>}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="idNumber">ID Number:</label>
            <input type="text" id="idNumber" {...register('idNumber')} />
            {errors.idNumber && <p className={styles.errorText}>{errors.idNumber.message}</p>}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="contact">Contact:</label>
            <input type="text" id="contact" {...register('contact')} />
            {errors.contact && <p className={styles.errorText}>{errors.contact.message}</p>}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="address">Address:</label>
            <input type="text" id="address" {...register('address')} />
            {errors.address && <p className={styles.errorText}>{errors.address.message}</p>}
          </div>
        </div>

        <div className={styles.formSection}>
          <h3>Parcel Geometry (Map)</h3>
          <Button type="button" onClick={handleGetLocation} disabled={geoLoading} variant="secondary">
            {geoLoading ? 'Getting Location...' : 'Get Current GPS Location'}
          </Button>
          {geoError && <p className={styles.errorText}>Error: {geoError}</p>}
          {location && (
            <p className={styles.locationInfo}>
              GPS: Lat {location.latitude.toFixed(5)}, Lon {location.longitude.toFixed(5)} (Accuracy: {location.accuracy.toFixed(1)}m)
            </p>
          )}

          <div className={styles.mapWrapper}>
            <MapDisplay
              center={mapCenter}
              zoom={mapZoom}
              onMapClick={handleMapClick}
              parcels={geometry ? [{ _id: 'temp-draw', geometry: geometry, ownerDetails: { ownerName: 'Temp' }, parcelId: 'Temp' }] : []} // Show drawn polygon
              showCurrentLocationMarker={!!location}
              currentLocation={location}
              className={styles.registrationMap}
            />
             {!geometry && <p className={styles.infoText}>Click on the map to draw a temporary polygon.</p>}
          </div>
        </div>

        <div className={styles.formSection}>
          <h3>Documents</h3>
          <div className={styles.formGroup}>
            <label htmlFor="documents">Upload Documents (PDF, Images):</label>
            <input type="file" id="documents" ref={fileInputRef} multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
            <p className={styles.infoText}>Max 10 files, up to 10MB each. Allowed types: PDF, JPG, PNG, DOC, DOCX.</p>
          </div>
        </div>

        <Button type="submit" variant="primary">Register Parcel</Button>
      </form>
    </div>
  );
}

export default ParcelRegistrationPage;