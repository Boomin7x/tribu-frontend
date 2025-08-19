/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  setHoveredFeature,
  setSelectedFeature,
  setZoomToFeature,
} from "@/app/store/slice/map.slice";
import type { RootState } from "@/app/store/store";
import { Icon } from "@iconify/react";
import { FeatureCollection } from "geojson";
import React, { useEffect, useMemo, useState } from "react";
import type { LayerProps } from "react-map-gl/mapbox";
import Map, {
  MapProvider,
  NavigationControl,
  Popup,
  useMap,
} from "react-map-gl/mapbox";
import { useDispatch, useSelector } from "react-redux";
// import { fakeData as oldFakeData } from "../(routes)/dashboard/location_int/layers/_component/buildings/BuildingDrawerDetails";
import useBuildingUtils from "../_hooks/useBuildingUtils";
import useDebounce from "../_hooks/useDebounce";
import useGeocode from "../_hooks/useGeoCode";
import useGeolocation from "../_hooks/useGeolocation";
import useJunctionUtils from "../_hooks/useJunctionUtils";
import useRoadsUtils from "../_hooks/useRoadsUtils";
import { setZoomToFeature as setCatZoom } from "../store/slice/map_category.slice";
import { setZoomToJunctionFeature } from "../store/slice/map_junction.slice";
import { setZoomToRoadFeature } from "../store/slice/map_road.slice";
import AppInput from "./AppInput";
import AppLoader from "./AppLoader";

const convertProjectedToGeographic = (
  x: number,
  y: number
): [number, number] => {
  const longitude = (x / 20037508.34) * 180;
  const latitude =
    (Math.atan(Math.exp((y * Math.PI) / 20037508.34)) * 2 - Math.PI / 2) *
    (180 / Math.PI);
  return [longitude, latitude];
};

export const convertFakeDataCoordinates = (
  originalData: any
): FeatureCollection => {
  if (!originalData?.data?.features) {
    return { type: "FeatureCollection", features: [] };
  }

  const convertedFeatures = originalData.data.features.map((feature: any) => ({
    ...feature,
    geometry: {
      ...feature.geometry,
      coordinates: feature.geometry.coordinates.map((ring: number[][]) =>
        ring.map((coord: number[]) =>
          convertProjectedToGeographic(coord[0], coord[1])
        )
      ),
    },
  }));

  return {
    type: "FeatureCollection",
    features: convertedFeatures,
  };
};

const GeneralMapsComponent = () => {
  const dispatch = useDispatch();
  const features = useSelector((state: RootState) => state.map.features);
  const selectedFeature = useSelector(
    (state: RootState) => state.map.selectedFeature
  );

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isStyleLoaded, setIsStyleLoaded] = useState(false);
  const { setLocation } = useGeolocation(false);
  const [address, setAddress] = useState("bonaberi");
  const { loading, geoData, geocode } = useGeocode();
  const [debouncedAddress] = useDebounce(address, 500);

  // // On mount, load fakeData into Redux
  // useEffect(() => {
  //   if (isDataDisplayed) dispatch(setFeatures(fakeData.features));
  //   else dispatch(setFeatures([]));
  // }, [dispatch, isDataDisplayed]);

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
      // dispatch(setGlobalBbox({ bbox: geoData?.bbox }));
    }
  }, [geoData]);

  const polygonLayer: LayerProps = {
    id: "building-fill",
    type: "fill",
    paint: {
      "fill-color": "red",
      "fill-opacity": 1, // Debug: fully opaque
    },
  };
  const outlineLayer: LayerProps = {
    id: "building-outline",
    type: "line",
    paint: {
      "line-color": "#0caf60",
      "line-width": 2,
    },
  };

  const {
    BuildingLayers,
    BuildingPopups,
    interactiveLayerIds: buildingLayerIds,
    onBuildingMapClick,
    BuildingMarkers,
  } = useBuildingUtils();
  const {
    RoadPopups,
    interactiveLayerIds: roadLayerIds,
    onRoadMapClick,
    RoadLayers,
  } = useRoadsUtils();
  const {
    JunctionLayers,
    JunctionPopups,
    interactiveLayerIds: junctionLayerIds,
    onJunctionMapClick,
    JunctionMarkers,
  } = useJunctionUtils();

  // Memoize the map layers to prevent re-renders
  const memoizedLayers = useMemo(
    () => (
      <>
        <BuildingLayers />
        <RoadLayers />
        <JunctionLayers />
      </>
    ),
    [BuildingLayers, RoadLayers, JunctionLayers]
  );

  // Memoize the popups to prevent re-renders
  const memoizedPopups = useMemo(
    () => (
      <>
        <BuildingPopups />
        <RoadPopups />
        <JunctionPopups />
      </>
    ),
    [BuildingPopups, RoadPopups, JunctionPopups]
  );

  // Memoize the markers to prevent re-renders
  const memoizedMarkers = useMemo(
    () => (
      <>
        {/* <BuildingMarkers /> */}
        <JunctionMarkers />
      </>
    ),
    [BuildingMarkers, JunctionMarkers]
  );

  // Merge interactiveLayerIds
  const allInteractiveLayerIds = [
    "test-polygon-fill",
    "buildings",
    ...buildingLayerIds,
    ...roadLayerIds,
    ...junctionLayerIds,
  ];

  console.log("interactiveLayerIds:", allInteractiveLayerIds);

  // Utility to ensure only serializable features are stored in Redux
  function toPlainFeature(feature: any) {
    if (feature && typeof feature.toGeoJSON === "function") {
      return feature.toGeoJSON();
    }
    if (feature && typeof feature.toJSON === "function") {
      return feature.toJSON();
    }
    return feature;
  }

  // Handle click/hover
  const onMapClick = (e: any) => {
    console.log("Map click event:", e);
    const feature = e.features && e.features[0];
    if (feature) {
      const plainFeature = toPlainFeature(feature);
      dispatch(setSelectedFeature(plainFeature));
    } else {
      dispatch(setSelectedFeature(null));
    }
    onBuildingMapClick(e);
    onRoadMapClick(e);
    onJunctionMapClick(e);
  };

  const onMapHover = (e: any) => {
    const feature = e.features && e.features[0];
    if (feature) {
      const plainFeature = feature.toGeoJSON
        ? feature.toGeoJSON()
        : {
            type: feature.type,
            id: feature.id,
            properties: feature.properties,
            geometry: feature.geometry,
          };
      dispatch(setHoveredFeature(plainFeature));
      // Set cursor to pointer
      e.target.getCanvas().style.cursor = "pointer";
      console.log("Hovered feature:", plainFeature);
    } else {
      dispatch(setHoveredFeature(null));
      // Reset cursor
      e.target.getCanvas().style.cursor = "";
    }
  };

  console.log({
    selectedFeature,
    features: features.length,
    isStyleLoaded,
    isLoaded,
    shouldRenderLayers: isStyleLoaded || isLoaded,
    polygonLayer,
    outlineLayer,
  });

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
                setIsStyleLoaded(true);
              }
              console.log({ type: e.type }, e);
            }}
            mapboxAccessToken={
              "pk.eyJ1IjoiYmV0cm9ib29taW4iLCJhIjoiY21jajNjOTUzMTkzcjJrc2VrNDFxZ3UwdyJ9.cMx-wHcsQi1ZJjDgb06BCA"
            }
            initialViewState={{
              longitude: geoData?.coordinates.longitude || 9.66,
              latitude: geoData?.coordinates.latitude || 4.08,
              zoom: 16,
              pitch: 50,
            }}
            style={{
              position: "absolute",
              inset: 0,
            }}
            mapStyle="mapbox://styles/betroboomin/cmcj495nl000v01s81843g8k4"
            // mapStyle="mapbox://styles/mapbox/streets-v11"
            // mapStyle="mapbox://styles/betroboomin/cmdknj5ur006o01s85yadf7mo"
            // mapStyle="mapbox://styles/mapbox/satellite-v9"
            interactiveLayerIds={allInteractiveLayerIds}
            onClick={onMapClick}
            onMouseMove={onMapHover}
          >
            <NavigationControl
              position="top-right"
              showCompass={true}
              showZoom={true}
              visualizePitch={true}
            />
            {(isStyleLoaded || isLoaded) && (
              <>
                {/* Test polygon for debugging */}
                {/* <Source id="test-polygon" type="geojson" data={geojson}>
                  <Layer
                    id="test-polygon-fill"
                    type="fill"
                    paint={{
                      "fill-color": "blue",
                      "fill-opacity": 1,
                    }}
                    beforeId="waterway-label" // Try to force above all
                  />
                </Source> */}
                {/* Your actual data source/layers */}
                {/* <Source id="buildings" type="geojson" data={geojson}>
                  <Layer {...polygonLayer} beforeId="waterway-label" />
                  <Layer {...outlineLayer} beforeId="waterway-label" />
                </Source> */}
                {memoizedLayers}
              </>
            )}
            {selectedFeature && selectedFeature.geometry.type === "Polygon" && (
              <Popup
                longitude={selectedFeature.geometry.coordinates[0][0][0]}
                latitude={selectedFeature.geometry.coordinates[0][0][1]}
                onClose={() => dispatch(setSelectedFeature(null))}
                closeButton={false}
                closeOnClick={false}
                anchor="top"
                offset={20}
              >
                <div className="min-w-[180px] bg-white  p-4 ">
                  <div className="font-bold text-base mb-1 text-gray-900">
                    {selectedFeature.properties?.name || "Building"}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Type:</span>{" "}
                    {selectedFeature.properties?.building || "N/A"}
                  </div>
                  <div className="text-xs text-gray-400">
                    <span className="font-medium">ID:</span>{" "}
                    {selectedFeature.id}
                  </div>
                </div>
              </Popup>
            )}
            {memoizedPopups}
            {memoizedMarkers}
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

GeneralMapsComponent.displayName = "GeneralMapsComponent";

const MapUpdater = React.memo(({ coordinates }: { coordinates: any }) => {
  const { current: map } = useMap();
  const dispatch = useDispatch();
  const mapCategories = useSelector((state: RootState) => state.map_many);
  const zoomToFeature = useSelector(
    (state: RootState) => state.map.zoomToFeature
  );

  useEffect(() => {
    if (map && coordinates) {
      map.flyTo({
        center: [coordinates.longitude, coordinates.latitude],
        zoom: 15,
        essential: true,
      });
    }
  }, [map, coordinates]);

  useEffect(() => {
    if (map && zoomToFeature && zoomToFeature.geometry?.type === "Polygon") {
      // Get the first coordinate of the first ring
      let coords = zoomToFeature.geometry.coordinates[0][0];
      if (!Array.isArray(coords) || coords.length !== 2) {
        coords = [0, 0];
      }
      map.flyTo({
        center: coords as [number, number],
        zoom: 18,
        essential: true,
      });
      dispatch(setZoomToFeature(null)); // Clear after zooming
    }
  }, [map, zoomToFeature, dispatch]);

  useEffect(() => {
    if (!map) return;
    Object.entries(mapCategories).forEach(([category, catState]) => {
      if (
        catState?.zoomToFeature &&
        catState.zoomToFeature.geometry.type === "Polygon"
      ) {
        const coords = catState.zoomToFeature.geometry.coordinates[0][0];
        map.flyTo({
          center: coords as [number, number],
          zoom: 18,
          essential: true,
        });
        // Clear zoom after flying
        dispatch(setCatZoom({ category, feature: null }));
      }
    });
  }, [map, mapCategories, dispatch]);

  const mapRoads = useSelector((state: RootState) => state.map_road);

  useEffect(() => {
    if (!map) return;
    Object.entries(mapRoads).forEach(([category, catState]) => {
      if (
        catState?.zoomToFeature &&
        catState.zoomToFeature.geometry.type === "LineString"
      ) {
        // Get the midpoint of the line
        const coords =
          catState.zoomToFeature.geometry.coordinates[
            Math.floor(catState.zoomToFeature.geometry.coordinates.length / 2)
          ];
        map.flyTo({
          center: coords as [number, number],
          zoom: 18,
          essential: true,
        });
        // Clear zoom after flying
        dispatch(setZoomToRoadFeature({ category, feature: null }));
      }
    });
  }, [map, mapRoads, dispatch]);

  const mapJunctions = useSelector((state: RootState) => state.map_junction);

  useEffect(() => {
    if (!map) return;
    Object.entries(mapJunctions).forEach(([category, catState]) => {
      if (
        catState?.zoomToFeature &&
        catState.zoomToFeature.geometry.type === "Point"
      ) {
        const coords = catState.zoomToFeature.geometry.coordinates;
        map.flyTo({
          center: coords as [number, number],
          zoom: 18,
          essential: true,
        });
        // Clear zoom after flying
        dispatch(setZoomToJunctionFeature({ category, feature: null }));
      }
    });
  }, [map, mapJunctions, dispatch]);

  return null;
});
MapUpdater.displayName = "MapUpdater";

export const GeneralMaps = React.memo(GeneralMapsComponent);
export default GeneralMaps;
