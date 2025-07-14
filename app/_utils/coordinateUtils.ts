// app/_utils/coordinateUtils.ts
import { Feature } from "geojson";

export function convertProjectedToGeographic(
  x: number,
  y: number
): [number, number] {
  const longitude = (x / 20037508.34) * 180;
  const latitude =
    (Math.atan(Math.exp((y * Math.PI) / 20037508.34)) * 2 - Math.PI / 2) *
    (180 / Math.PI);
  return [longitude, latitude];
}

export function convertFeatureToGeographic(feature: Feature): Feature {
  if (feature.geometry.type === "Polygon") {
    return {
      ...feature,
      geometry: {
        ...feature.geometry,
        coordinates: (feature.geometry.coordinates as number[][][]).map(
          (ring) =>
            ring.map((coord) =>
              convertProjectedToGeographic(coord[0], coord[1])
            )
        ),
      },
    };
  }
  // Add support for other geometry types if needed
  return feature;
}
