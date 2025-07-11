import { useState, useEffect } from "react";
import { Coordinates } from "../_utils/types";
// import { Coordinates } from '../interfaces/coordinates';
// Define the type for the location object
export interface GeolocationError extends Error {
  message: string;
}
export const useGeolocation = (watch: boolean = false) => {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);

  // Function to handle geolocation retrieval
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (err: GeolocationPositionError) => {
          setError(err.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  // If `watch` is true, continuously track position
  useEffect(() => {
    if (watch && navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        (position: GeolocationPosition) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (err: GeolocationPositionError) => {
          setError(err.message);
        }
      );
      setWatchId(id);

      // Cleanup: clear the watch when the component unmounts
      return () => {
        if (watchId !== null) {
          navigator.geolocation.clearWatch(watchId);
        }
      };
    } else {
      // If `watch` is false, get the current position once
      getLocation();
    }
  }, [watch, watchId]);

  return { location, error, setLocation };
};

export default useGeolocation;
