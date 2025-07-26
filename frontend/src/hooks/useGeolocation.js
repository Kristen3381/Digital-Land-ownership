import { useState, useEffect } from 'react';

const useGeolocation = () => {
  const [location, setLocation] = useState(null); // { latitude, longitude }
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    const successHandler = (position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      });
      setLoading(false);
    };

    const errorHandler = (geoError) => {
      let errorMessage = 'An unknown error occurred.';
      switch (geoError.code) {
        case geoError.PERMISSION_DENIED:
          errorMessage = 'Location permission denied by the user.';
          break;
        case geoError.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable.';
          break;
        case geoError.TIMEOUT:
          errorMessage = 'The request to get user location timed out.';
          break;
        default:
          break;
      }
      setError(errorMessage);
      setLoading(false);
    };

    navigator.geolocation.getCurrentPosition(successHandler, errorHandler, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
  };

  // Optional: Listen for changes if you need continuous updates (less common for one-time capture)
  // useEffect(() => {
  //   const watchId = navigator.geolocation.watchPosition(
  //     (position) => setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
  //     (err) => setError(err.message)
  //   );
  //   return () => navigator.geolocation.clearWatch(watchId);
  // }, []);

  return { location, error, loading, getCurrentLocation };
};

export default useGeolocation;