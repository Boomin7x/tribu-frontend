import { useState } from "react";
import { Coordinates, GeoJSON } from "../_utils/types";
import { setGlobalBbox } from "../store/slice/globalBbox.slice";
import { useDispatch } from "react-redux";
export interface GeocodeResponse {
  coordinates: Coordinates;
  text: string;
  place_name: string;
}

const useGeocode = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [geoData, setGeoData] = useState<GeocodeResponse | undefined>(
    undefined
  );
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const geocode = async (address: string) => {
    // const env = import.meta.env;

    const apiKey = process.env.NEXT_PUBLIC_MAP_BOX_KEY; // Replace with your Mapbox API Key
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      address
    )}.json?access_token=${apiKey}`;

    try {
      setLoading(true);
      const response = await fetch(url);
      const data: GeoJSON = await response.json();

      if (data.features && data.features.length > 0) {
        const { center, place_name, text, bbox } = data.features[0]; // 'center' contains the [longitude, latitude] array
        console.log("bbox from Address", bbox);
        dispatch(setGlobalBbox({ bbox }));
        setGeoData({
          coordinates: { latitude: center[1], longitude: center[0] },
          place_name,
          text,
        });
        setError(null);
      } else {
        setError("Geocoding failed. Please try another address.");
      }
      return geoData;
    } catch (err) {
      console.log("error goecode", err);
      setError("Error fetching geolocation data.");
    } finally {
      setLoading(false);
    }
  };

  return { geoData, error, geocode, loading };
};

export default useGeocode;
