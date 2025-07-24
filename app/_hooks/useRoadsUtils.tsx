/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { RootState } from "../store/store";
import { Layer, Popup, Source } from "react-map-gl/mapbox";
import { setSelectedRoadFeature } from "../store/slice/map_road.slice";
import { Marker } from "react-map-gl/mapbox";

// Road category to color mapping
export const ROAD_CATEGORY_COLORS: Record<string, string> = {
  bridleway: "#8B4513",
  construction: "#A9A9A9",
  cycleway: "#1E90FF",
  escape: "#FFD700",
  footway: "#32CD32",
  living_street: "#FF69B4",
  motorway: "#FF0000",
  motorway_link: "#FF6347",
  passing_place: "#BDB76B",
  path: "#8FBC8F",
  pedestrian: "#00CED1",
  primary: "#FFA500",
  primary_link: "#FFB347",
  proposed: "#D3D3D3",
  residential: "#4682B4",
  secondary: "#FFFF00",
  secondary_link: "#FFFF99",
  service: "#C0C0C0",
  steps: "#A0522D",
  tertiary: "#ADFF2F",
  tertiary_link: "#BFFF00",
  track: "#DEB887",
  trunk: "#228B22",
  trunk_link: "#7CFC00",
  unclassified: "#D2691E",
};

// Memoized LayerSource for roads
const RoadLayerSource: React.FC<{ category: string; catState: any }> =
  React.memo(function RoadLayerSource({ catState, category }) {
    const geojsonData = useMemo(
      () => ({
        type: "FeatureCollection" as const,
        features: catState.features ?? [],
      }),
      [catState.features]
    );
    // Pick color for this category, fallback to red
    const lineColor = ROAD_CATEGORY_COLORS[category] || "#e33116";
    return (
      <Source id={`road-source-${category}`} type="geojson" data={geojsonData}>
        <Layer
          id={`road-line-${category}`}
          type="line"
          paint={{
            "line-color": lineColor,
            "line-width": 8,
            // Temporarily use solid line for debugging
            // "line-dasharray": [2, 4],
          }}
        />
      </Source>
    );
  });
RoadLayerSource.displayName = "RoadLayerSource";

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

const useRoadsUtils = () => {
  const mapRoads = useSelector(
    (state: RootState) => state.map_road,
    shallowEqual
  );
  const dispatch = useDispatch();

  // Memoize interactiveLayerIds
  const interactiveLayerIds = useMemo(
    () => Object.keys(mapRoads).map((category) => `road-line-${category}`),
    [mapRoads]
  );

  // Memoize RoadLayers
  const RoadLayers = useMemo(() => {
    const Component = () => (
      <>
        {Object.entries(mapRoads).map(([category, catState]) =>
          catState?.toggleRoadView &&
          catState.features &&
          catState.features.length > 0 ? (
            <RoadLayerSource
              catState={catState}
              category={category}
              key={category}
            />
          ) : null
        )}
      </>
    );
    Component.displayName = "RoadLayers";
    return Component;
  }, [mapRoads]);

  // RoadPopups
  const RoadPopups = useMemo(() => {
    const RoadPopupsComponent: React.FC = () => (
      <>
        {Object.entries(mapRoads).map(([category, catState]) => {
          if (
            catState?.selectedFeature &&
            catState.selectedFeature.geometry?.type === "LineString"
          ) {
            const geometry = catState.selectedFeature.geometry as {
              type: "LineString";
              coordinates: number[][];
            };
            // Use the midpoint of the line for the popup
            const coords =
              geometry?.coordinates?.[
                Math.floor(geometry.coordinates.length / 2)
              ];
            if (!coords) return null;
            return (
              <Popup
                key={category}
                longitude={coords[0]}
                latitude={coords[1]}
                onClose={() =>
                  dispatch(setSelectedRoadFeature({ category, feature: null }))
                }
                closeButton={false}
                closeOnClick={false}
                anchor="top"
                offset={20}
              >
                <div className="min-w-[180px] bg-white  p-4 ">
                  <div className="font-bold text-base mb-1 text-gray-900">
                    {catState.selectedFeature.properties?.name || "Road"}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Type:</span>{" "}
                    {catState.selectedFeature.properties?.highway || "N/A"}
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
    RoadPopupsComponent.displayName = "RoadPopups";
    return RoadPopupsComponent;
  }, [mapRoads, dispatch]);

  // Memoize click handler
  const onRoadMapClick = useCallback(
    (e: any) => {
      const feature = e.features && e.features[0];
      if (feature) {
        console.log("Road click:", feature, feature.layer?.id);
        const category = feature.layer.id.replace("road-line-", "");
        const plainFeature = toPlainFeature(feature);
        dispatch(setSelectedRoadFeature({ category, feature: plainFeature }));
      } else {
        console.log("Road click: no feature");
      }
    },
    [dispatch]
  );

  // RoadMarkers (optional, for points or labels)
  const RoadMarkers = useMemo(() => {
    const MarkersComponent: React.FC = () => (
      <>
        {Object.entries(mapRoads).map(([category, catState]) => {
          if (
            catState?.toggleRoadView &&
            catState.features &&
            catState.features.length > 0
          ) {
            return catState.features.map((feature, idx) => {
              let lng = 0,
                lat = 0;
              if (
                feature.geometry.type === "LineString" &&
                feature.geometry.coordinates?.length
              ) {
                // Use midpoint of the line
                const coords =
                  feature.geometry.coordinates[
                    Math.floor(feature.geometry.coordinates.length / 2)
                  ];
                [lng, lat] = coords;
              } else if (
                feature.geometry.type === "Point" &&
                Array.isArray(feature.geometry.coordinates)
              ) {
                [lng, lat] = feature.geometry.coordinates;
              } else {
                return null;
              }
              // Pick color for this category, fallback to red
              const markerColor = ROAD_CATEGORY_COLORS[category] || "#e33116";
              return (
                <Marker
                  key={`${category}-road-marker-${feature.id ?? idx}`}
                  longitude={lng}
                  latitude={lat}
                  anchor="top"
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        background: "white",
                        color: markerColor,
                        fontSize: 12,
                        padding: "2px 6px",
                        borderRadius: 4,
                        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                        marginTop: 2,
                        whiteSpace: "nowrap",
                        position: "relative",
                      }}
                    >
                      🛣️ {feature.properties?.name || feature.id || "Road"}
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
                          borderTop: `6px solid ${markerColor}`,
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
    MarkersComponent.displayName = "RoadMarkers";
    return MarkersComponent;
  }, [mapRoads]);

  return {
    RoadPopups,
    onRoadMapClick,
    interactiveLayerIds,
    RoadLayers,
    RoadMarkers,
  };
};

export default useRoadsUtils;
