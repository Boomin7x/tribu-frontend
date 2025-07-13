/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import Map, {
  MapProvider,
  NavigationControl,
  useMap,
} from "react-map-gl/mapbox";
import AppLoader from "./AppLoader";
import AppInput from "./AppInput";
import useGeocode from "../_hooks/useGeoCode";
import useGeolocation from "../_hooks/useGeolocation";
import useDebounce from "../_hooks/useDebounce";

const GeneralMapsComponent = () => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const { setLocation } = useGeolocation(false);
  const [address, setAddress] = useState("douala");
  const { loading, geoData, geocode } = useGeocode();
  const [debouncedAddress] = useDebounce(address, 500);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
    console.log("Address changed:", e.target.value);
  };

  useEffect(() => {
    if (debouncedAddress) {
      geocode(debouncedAddress);
    }
  }, [debouncedAddress]);

  useEffect(() => {
    if (geoData) {
      setLocation(geoData?.coordinates);
      //   props.onLocationUpdate(geoData);
    }
  }, [geoData]);

  console.log({ geoData });
  return (
    <div className="size-full ">
      <AppInput
        type="text"
        id=""
        onChange={handleChange}
        placeholder="Enter location"
        style={{
          background: "white",
          width: "40%",
          position: "absolute",
          top: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          borderRadius: "none",
        }}
        startAdornment={
          <Icon icon="ph:map-pin-light" className="mr-2 size-5" />
        }
      />
      <MapProvider>
        <div className="w-full  relative h-full">
          <Map
            onLoad={(e) => {
              if (e.type === "load") {
                setIsLoaded(true);
              }
              console.log(e);
            }}
            mapboxAccessToken={
              "pk.eyJ1IjoiYmV0cm9ib29taW4iLCJhIjoiY21jajNjOTUzMTkzcjJrc2VrNDFxZ3UwdyJ9.cMx-wHcsQi1ZJjDgb06BCA"
              //   mapBoxKey
            }
            initialViewState={{
              longitude: geoData?.coordinates.longitude,
              latitude: geoData?.coordinates.latitude,
              zoom: 12,
            }}
            style={{
              position: "absolute",
              inset: 0,
            }}
            mapStyle="mapbox://styles/betroboomin/cmcj495nl000v01s81843g8k4"
          >
            <NavigationControl
              position="top-right"
              showCompass={true}
              showZoom={true}
              visualizePitch={true}
            />
            <MapUpdater coordinates={geoData?.coordinates} />
          </Map>

          {!isLoaded || loading ? (
            <AppLoader className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          ) : null}
        </div>
      </MapProvider>
    </div>
  );
};

const MapUpdater = ({ coordinates }: { coordinates: any }) => {
  const { current: map } = useMap();

  useEffect(() => {
    if (map && coordinates) {
      map.flyTo({
        center: [coordinates.longitude, coordinates.latitude],
        zoom: 8,
        essential: true,
      });
    }
  }, [map, coordinates]);

  return null;
};

export const GeneralMaps = React.memo(GeneralMapsComponent);
