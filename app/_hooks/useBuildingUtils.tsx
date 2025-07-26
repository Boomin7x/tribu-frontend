/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useMemo, useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { RootState } from "../store/store";
import { Layer, Popup, Source } from "react-map-gl/mapbox";
import {
  MapCategoryState,
  setSelectedFeature,
} from "../store/slice/map_category.slice";
import { Marker } from "react-map-gl/mapbox";

// Memoized LayerSource to prevent unnecessary rerenders
const LayerSource: FC<{ category: string; catState: MapCategoryState }> =
  React.memo(function LayerSource({ catState, category }) {
    const geojsonData = useMemo(
      () => ({
        type: "FeatureCollection" as const,
        features: catState.features ?? [],
      }),
      [catState.features]
    );

    return (
      <Source id={`source-${category}`} type="geojson" data={geojsonData}>
        {/* Hide Mapbox's built-in buildings */}
        {/* <Layer
          id={`hide-buildings-${category}`}
          type="fill"
          source="composite"
          source-layer="building"
          paint={{
            "fill-color": "transparent",
            "fill-opacity": 0,
          }}
        /> */}
        <Layer
          id={`fill-${category}`}
          type="fill-extrusion"
          paint={{
            "fill-extrusion-height": 30,
            "fill-extrusion-color": "#8B5CF6", // Purple color
            // "fill-extrusion-opacity": 0.85,
            "fill-extrusion-opacity": 1,
            "fill-extrusion-base": 0,
          }}
        />
        {/* <Layer
          id={`${category}-labels`}
          type="symbol"
          layout={{
            "text-field": ["get", "building"], // Use 'name' property, fallback to 'building' if needed
            "text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
            "text-size": 12,
            "text-anchor": "center",
            "text-justify": "center",
            "text-allow-overlap": false,
            "text-ignore-placement": false,
          }}
          paint={{
            "text-color": "#333333",
            "text-halo-color": "#ffffff",
            "text-halo-width": 1,
          }}
        /> */}
        {/* <Layer
          id={`outline-${category}`}
          type="line"
          paint={{
            "line-color": "#333",
            "line-width": 2,
          }}
        /> */}
      </Source>
    );
  });
LayerSource.displayName = "LayerSource";

const useBuildingUtils = () => {
  const mapFeatures = useSelector(
    (state: RootState) => state.map_many,
    shallowEqual
  );
  const dispatch = useDispatch();

  // Memoize interactiveLayerIds
  const interactiveLayerIds = useMemo(
    () => Object.keys(mapFeatures).map((category) => `fill-${category}`),
    [mapFeatures]
  );

  // Memoize BuildingLayers
  const BuildingLayers = useMemo(() => {
    const Component = () => (
      <>
        {Object.entries(mapFeatures).map(([category, catState]) =>
          catState?.toggleMavView &&
          catState.features &&
          catState.features.length > 0 ? (
            <LayerSource
              catState={catState}
              category={category}
              key={category}
            />
          ) : null
        )}
      </>
    );
    Component.displayName = "BuildingLayers";
    return Component;
  }, [mapFeatures]);

  // Define BuildingPopups as a named component to fix missing display name lint
  const BuildingPopups = useMemo(() => {
    const BuildingPopupsComponent: React.FC = () => (
      <>
        {Object.entries(mapFeatures).map(([category, catState]) => {
          if (
            catState?.selectedFeature &&
            catState.selectedFeature.geometry?.type === "Polygon"
          ) {
            // Use proper typing for geometry
            const geometry = catState.selectedFeature.geometry as {
              type: "Polygon";
              coordinates: number[][][];
            };
            const coords = geometry?.coordinates?.[0]?.[0];
            if (!coords) return null;
            return (
              <Popup
                key={category}
                longitude={coords[0]}
                latitude={coords[1]}
                onClose={() =>
                  dispatch(setSelectedFeature({ category, feature: null }))
                }
                closeButton={false}
                closeOnClick={false}
                anchor="top"
                offset={20}
              >
                <div className="min-w-[180px] bg-white  p-4 ">
                  <div className="font-bold text-base mb-1 text-gray-900">
                    {catState.selectedFeature.properties?.name || "Building"}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Type:</span>{" "}
                    {catState.selectedFeature.properties?.building || "N/A"}
                  </div>
                  <div className="text-xs text-gray-400">
                    <span className="font-medium">ID:</span>{" "}
                    {catState.selectedFeature.id}
                  </div>
                </div>
              </Popup>
            );
          }
          return null;
        })}
      </>
    );
    BuildingPopupsComponent.displayName = "BuildingPopups";
    return BuildingPopupsComponent;
  }, [mapFeatures, dispatch]);

  // Memoize click handler
  const onBuildingMapClick = useCallback(
    (e: any) => {
      const feature = e.features && e.features[0];
      if (feature) {
        const category = feature.layer.id.replace("fill-", "");
        dispatch(
          setSelectedFeature({ category, feature: feature.toGeoJSON() })
        );
      }
    },
    [dispatch]
  );

  const BuildingMarkers = useMemo(() => {
    function getPolygonCentroid(coordinates: number[][][]) {
      const ring = coordinates[0];
      let x = 0,
        y = 0,
        area = 0;
      const n = ring.length;
      for (let i = 0; i < n - 1; i++) {
        const [x0, y0] = ring[i];
        const [x1, y1] = ring[i + 1];
        const a = x0 * y1 - x1 * y0;
        area += a;
        x += (x0 + x1) * a;
        y += (y0 + y1) * a;
      }
      area *= 0.5;
      if (area === 0) return ring[0];
      x /= 6 * area;
      y /= 6 * area;
      return [x, y];
    }
    const MarkersComponent: React.FC = () => (
      <>
        {Object.entries(mapFeatures).map(([category, catState]) => {
          if (
            catState?.toggleMavView &&
            catState.features &&
            catState.features.length > 0
          ) {
            return catState.features.map((feature, idx) => {
              const label =
                feature.properties?.name ||
                feature.properties?.building ||
                feature.id ||
                "Building";
              // For Polygon, use the first coordinate of the first ring as marker position
              let lng = 0,
                lat = 0;
              if (
                feature.geometry.type === "Polygon" &&
                feature.geometry.coordinates?.[0]?.[0]
              ) {
                [lng, lat] = getPolygonCentroid(feature.geometry.coordinates);
              } else if (
                feature.geometry.type === "Point" &&
                Array.isArray(feature.geometry.coordinates)
              ) {
                [lng, lat] = feature.geometry.coordinates;
              } else {
                return null;
              }
              return (
                <Marker
                  key={`${category}-marker-${feature.id ?? idx}`}
                  longitude={lng}
                  latitude={lat}
                  anchor="top"
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      pointerEvents: "none", // so marker doesn't block map clicks
                    }}
                  >
                    <span
                      style={{
                        background: "white",
                        color: "#333",
                        fontSize: 12,
                        padding: "2px 6px",
                        borderRadius: 4,
                        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                        marginTop: 2,
                        whiteSpace: "nowrap",
                        position: "relative",
                      }}
                    >
                      🏢 {label}
                      {/* Arrow/anchor below the label */}
                      <span
                        style={{
                          position: "absolute",
                          left: "50%",
                          transform: "translateX(-50%)",
                          bottom: -6,
                          width: 0,
                          height: 0,
                          borderLeft: "6px solid transparent",
                          borderRight: "6px solid transparent",
                          borderTop: "6px solid white",
                          zIndex: 1,
                        }}
                      />
                    </span>
                  </div>
                </Marker>
              );
            });
          }
          return null;
        })}
      </>
    );
    MarkersComponent.displayName = "BuildingMarkers";
    return MarkersComponent;
  }, [mapFeatures]);

  return {
    BuildingPopups,
    onBuildingMapClick,
    interactiveLayerIds,
    BuildingLayers,
    BuildingMarkers,
  };
};

export default useBuildingUtils;
