import React, { useMemo, useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { RootState } from "../store/store";
import { Layer, Popup, Source } from "react-map-gl/mapbox";
import { setSelectedJunctionFeature } from "../store/slice/map_junction.slice";
import { Marker } from "react-map-gl/mapbox";
import { Feature } from "geojson";

interface JunctionCategoryState {
  features: Feature[] | null;
  selectedFeature: Feature | null;
  hoveredFeature: Feature | null;
  zoomToFeature: Feature | null;
  toggleJunctionView: boolean;
}

interface MapboxFeatureEvent {
  features?: (Feature & { layer: { id: string }; toGeoJSON?: () => Feature })[];
}

// Memoized LayerSource for junctions
const JunctionLayerSource: React.FC<{
  category: string;
  catState: JunctionCategoryState;
}> = React.memo(function JunctionLayerSource({ catState, category }) {
  const geojsonData = useMemo(
    () => ({
      type: "FeatureCollection" as const,
      features: catState.features ?? [],
    }),
    [catState.features]
  );
  return (
    <Source
      id={`junction-source-${category}`}
      type="geojson"
      data={geojsonData}
    >
      <Layer
        id={`junction-point-${category}`}
        type="circle"
        paint={{
          "circle-radius": 7,
          "circle-color": "#f59e42",
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
        }}
      />
    </Source>
  );
});
JunctionLayerSource.displayName = "JunctionLayerSource";

const useJunctionUtils = () => {
  const mapJunctions = useSelector(
    (state: RootState) => state.map_junction,
    shallowEqual
  );
  const dispatch = useDispatch();

  console.log("available Junctions", mapJunctions);

  // Memoize interactiveLayerIds
  const interactiveLayerIds = useMemo(
    () =>
      Object.keys(mapJunctions).map((category) => `junction-point-${category}`),
    [mapJunctions]
  );

  // Memoize JunctionLayers
  const JunctionLayers = useMemo(() => {
    const Component = () => (
      <>
        {Object.entries(mapJunctions).map(([category, catState]) =>
          catState?.toggleJunctionView &&
          catState.features &&
          catState.features.length > 0 ? (
            <JunctionLayerSource
              catState={catState as JunctionCategoryState}
              category={category}
              key={category}
            />
          ) : null
        )}
      </>
    );
    Component.displayName = "JunctionLayers";
    return Component;
  }, [mapJunctions]);

  // JunctionPopups
  const JunctionPopups = useMemo(() => {
    const JunctionPopupsComponent: React.FC = () => (
      <>
        {Object.entries(mapJunctions).map(([category, catState]) => {
          if (
            catState?.selectedFeature &&
            catState.selectedFeature.geometry?.type === "Point"
          ) {
            const geometry = catState.selectedFeature.geometry as {
              type: "Point";
              coordinates: [number, number];
            };
            const coords = geometry?.coordinates;
            if (!coords) return null;
            return (
              <Popup
                key={category}
                longitude={coords[0]}
                latitude={coords[1]}
                onClose={() =>
                  dispatch(
                    setSelectedJunctionFeature({ category, feature: null })
                  )
                }
                closeButton={false}
                closeOnClick={false}
                anchor="top"
                offset={20}
              >
                <div className="min-w-[180px] bg-white  p-4 ">
                  <div className="font-bold text-base mb-1 text-gray-900">
                    {catState.selectedFeature.properties
                      ?.junction_type_description || "Junction"}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Type:</span>{" "}
                    {catState.selectedFeature.properties?.junction_type_code ||
                      "N/A"}
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
    JunctionPopupsComponent.displayName = "JunctionPopups";
    return JunctionPopupsComponent;
  }, [mapJunctions, dispatch]);

  // Memoize click handler
  const onJunctionMapClick = useCallback(
    (e: MapboxFeatureEvent) => {
      const feature = e.features && e.features[0];
      if (feature) {
        const category = feature.layer.id.replace("junction-point-", "");
        console.log("Junction click:", {
          category,
          feature,
          layerId: feature.layer.id,
        });
        dispatch(
          setSelectedJunctionFeature({
            category,
            feature: feature.toGeoJSON ? feature.toGeoJSON() : feature,
          })
        );
      }
    },
    [dispatch]
  );

  // JunctionMarkers (optional, for custom icons/labels)
  const JunctionMarkers = useMemo(() => {
    const MarkersComponent: React.FC = () => (
      <>
        {Object.entries(mapJunctions).map(([category, catState]) => {
          if (
            catState?.toggleJunctionView &&
            catState.features &&
            catState.features.length > 0
          ) {
            return catState.features.map((feature: Feature, idx: number) => {
              if (
                feature.geometry.type === "Point" &&
                Array.isArray(feature.geometry.coordinates)
              ) {
                const [lng, lat] = feature.geometry.coordinates;
                if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null;
                return (
                  <Marker
                    key={`${category}-junction-marker-${feature.id ?? idx}`}
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
                          background: "#f59e42",
                          color: "#fff",
                          fontSize: 12,
                          padding: "2px 6px",
                          borderRadius: 4,
                          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                          marginTop: 2,
                          whiteSpace: "nowrap",
                          position: "relative",
                        }}
                      >
                        ⚡{" "}
                        {feature.properties?.junction_type_description ||
                          feature.id ||
                          "Junction"}
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
                            borderTop: "6px solid #f59e42",
                            zIndex: 1,
                          }}
                        />
                      </span>
                    </div>
                  </Marker>
                );
              }
              return null;
            });
          }
          return null;
        })}
      </>
    );
    MarkersComponent.displayName = "JunctionMarkers";
    return MarkersComponent;
  }, [mapJunctions]);

  return {
    JunctionPopups,
    onJunctionMapClick,
    interactiveLayerIds,
    JunctionLayers,
    JunctionMarkers,
  };
};

export default useJunctionUtils;
