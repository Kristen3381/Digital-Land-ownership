import React, { useEffect, useRef } from 'react'; // Added useRef
import { MapContainer, TileLayer, Polygon, Marker, Popup, useMap } from 'react-leaflet'; // Added Popup
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
draw CSS and React-Leaflet-Draw components
import 'leaflet-draw/dist/leaflet.draw.css';
import { FeatureGroup } from 'react-leaflet'; // Correct import for FeatureGroup
import { EditControl } from 'react-leaflet-draw'; // Correct import for EditControl

import styles from './MapDisplay.module.css'; // Use CSS Modules for styling
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// A component to re-center the map if location prop changes
const RecenterAutomatically = ({ lat, lon }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lon) {
      map.setView([lat, lon], map.getZoom());
    }
  }, [lat, lon, map]);
  return null;
};

// Add a new prop for handling drawn shapes
const MapDisplay = ({
  parcels = [],
  center = [-0.076, 34.78],
  zoom = 12,
  className,
  onMapClick, // This is for general map clicks, not drawing
  onShapeDrawn, // <-- NEW PROP: Callback for when a shape is drawn
  showCurrentLocationMarker,
  currentLocation
}) => {
  // useRef to get a reference to the FeatureGroup for programmatically clearing layers if needed
  const featureGroupRef = useRef();

  const convertGeoJsonToLeaflet = (geoJsonCoords) => {
    if (!geoJsonCoords || !geoJsonCoords[0]) return [];
    // For a Polygon, coordinates are [array of rings], each ring is [[lon, lat], ...]
    // We only take the first ring for simplicity
    return geoJsonCoords[0].map(coord => [coord[1], coord[0]]);
  };

  const _onCreated = (e) => {
    const { layerType, layer } = e;
    console.log("Shape Drawn:", layerType, layer);

    if (layerType === 'polygon' || layerType === 'rectangle') {
      const geoJson = layer.toGeoJSON();
      console.log('Drawn GeoJSON Polygon:', geoJson);
      if (onShapeDrawn) {
        onShapeDrawn(geoJson); // Pass the GeoJSON to the parent component
      }
    } else if (layerType === 'polyline') {
      const geoJson = layer.toGeoJSON();
      console.log('Drawn GeoJSON Polyline:', geoJson);
      if (onShapeDrawn) {
        onShapeDrawn(geoJson); // Pass the GeoJSON to the parent component
      }
    } else if (layerType === 'marker') {
      const geoJson = layer.toGeoJSON();
      console.log('Drawn GeoJSON Marker:', geoJson);
      if (onShapeDrawn) {
        onShapeDrawn(geoJson); // Pass the GeoJSON to the parent component
      }
    }

    // Optional: To prevent multiple drawings, you might want to clear the layer
    // For a single drawing, you might want to remove this or manage it from parent
    // const drawnItems = featureGroupRef.current;
    // drawnItems.eachLayer(l => drawnItems.removeLayer(l)); // Clear all drawn layers
  };

  // You can also handle edited, deleted, or other events if needed
  const _onEdited = (e) => {
    const { layers } = e;
    layers.eachLayer(layer => {
      console.log('Shape Edited:', layer.toGeoJSON());
      if (onShapeDrawn) { // Re-send updated GeoJSON if needed
        onShapeDrawn(layer.toGeoJSON());
      }
    });
  };

  const _onDeleted = (e) => {
    const { layers } = e;
    layers.eachLayer(layer => {
      console.log('Shape Deleted:', layer.toGeoJSON());
      // Logic to remove from your data
    });
  };

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      className={`${styles.mapContainer} ${className}`}
      // onClick={onMapClick} // General map click, kept if needed for other purposes
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* FeatureGroup to hold drawn items and EditControl */}
      <FeatureGroup ref={featureGroupRef}>
        <EditControl
          position="topright" // Position of the drawing toolbar
          onCreated={_onCreated}
          onEdited={_onEdited}
          onDeleted={_onDeleted}
          draw={{
            rectangle: true, // Enable drawing rectangles
            polygon: {
                allowIntersection: false, // Prevent polygons from intersecting
                drawError: {
                    color: '#e1e100', // Color of the shape when it's not valid
                    message: '<strong>Oh snap!</strong> you can\'t draw that!' // Message when shape is invalid
                },
                shapeOptions: {
                    color: 'var(--color-accent)' // Color of the drawn polygon
                }
            },
            polyline: {
                shapeOptions: {
                    color: 'var(--color-primary)'
                }
            },
            circle: false, // Disable drawing circles
            circlemarker: false, // Disable drawing circle markers
            marker: true, // Enable drawing markers
          }}
          edit={{
            featureGroup: featureGroupRef.current, // Pass the ref to the feature group
            remove: true, // Allow deletion of drawn shapes
            edit: true // Allow editing of drawn shapes
          }}
        />

        {parcels.map((parcel) => (
          <Polygon
            key={parcel._id}
            positions={convertGeoJsonToLeaflet(parcel.geometry.coordinates)}
            pathOptions={{ color: 'var(--color-primary)', weight: 2 }}
            eventHandlers={{
              click: () => { console.log('Parcel clicked:', parcel.parcelId); /* Add detail view logic */ }
            }}
          >
            <Popup> {/* Corrected L.Popup to Popup for react-leaflet */}
              <div>
                <strong>Parcel ID:</strong> {parcel.parcelId}<br />
                <strong>Owner:</strong> {parcel.ownerDetails.ownerName}<br />
                <strong>Status:</strong> {parcel.status}
              </div>
            </Popup>
          </Polygon>
        ))}
      </FeatureGroup>

      {showCurrentLocationMarker && currentLocation && (
        <Marker position={[currentLocation.latitude, currentLocation.longitude]}>
            <Popup>Your Current GPS Location</Popup> {/* Corrected L.Popup to Popup */}
        </Marker>
      )}

      {/* Recenter the map if center prop changes dynamically (e.g., from GPS) */}
      <RecenterAutomatically lat={center[0]} lon={center[1]} />
    </MapContainer>
  );
};

export default MapDisplay;