import React from 'react'; // Added useState if you want to store drawn shape temporarily
import MapDisplay from '../../components/MapDisplay/MapDisplay';
import styles from '../Admin/Admin.module.css'; // Reusing for container styling

function MapViewPage() {
  // In a real app, you'd fetch parcels to display them on the map
  // const [parcels, setParcels] = useState([]);
  // useEffect(() => {
  //   fetchParcelsFromBackend().then(data => setParcels(data));
  // }, []);

  const handleShapeDrawn = (geoJson) => {
    console.log("Shape drawn in MapViewPage:", geoJson);
    // Here, you would typically:
    // 1. Validate the GeoJSON (e.g., check if it's a valid polygon)
    // 2. Prepare the data to be sent to your backend (e.g., for parcel registration)
    // 3. Make an API call to save the new parcel/geometry
    // 4. Optionally, update the local state to display the newly drawn parcel
    alert('Shape drawn! Check console for GeoJSON data. You would now save this to your backend.');
    // Example of how you might send it to a backend service:
    // createParcelService(geoJson)
    //   .then(response => { showNotification('Parcel created!', 'success'); })
    //   .catch(error => { showNotification('Failed to create parcel.', 'error'); });
  };

  return (
    <div className={styles.adminContainer}>
      <h2 className={styles.title}>Interactive Land Map</h2>
      <div style={{ height: '600px', width: '100%' }}>
        <MapDisplay
          // parcels={parcels} // Pass fetched parcels here
          center={[-0.076, 34.78]} // Centered on Kakamega, Kenya
          zoom={13}
          className={styles.mapFullScreen} // Example for larger map on this page
          onShapeDrawn={handleShapeDrawn} // Pass the new handler
        />
      </div>
      <p style={{ marginTop: 'var(--spacing-md)' }}>This map will display all registered land parcels. Use the drawing tools on the top right to draw new segments.</p>
    </div>
  );
}
export default MapViewPage;