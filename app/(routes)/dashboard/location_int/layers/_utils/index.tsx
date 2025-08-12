import { Feature } from "geojson";
export const isColorLight = (hexColor: string): boolean => {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
};

const computePolygonCentroid = (coords: number[][][]): [number, number] => {
  const ring = coords[0];
  let twiceArea = 0;
  let cx = 0;
  let cy = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [x0, y0] = ring[j];
    const [x1, y1] = ring[i];
    const f = x0 * y1 - x1 * y0;
    twiceArea += f;
    cx += (x0 + x1) * f;
    cy += (y0 + y1) * f;
  }
  if (twiceArea === 0) return ring[0] as [number, number];
  const area = twiceArea * 0.5;
  return [cx / (6 * area), cy / (6 * area)];
};
const parseBbox = (bboxStr: string) => {
  const [minLon, minLat, maxLon, maxLat] = bboxStr
    .split(",")
    .map((v) => parseFloat(v.trim()));
  return { minLon, minLat, maxLon, maxLat };
};

export const findDensestCell = (
  features: Feature[],
  bboxStr: string,
  gridSize = 20
) => {
  const { minLon, minLat, maxLon, maxLat } = parseBbox(bboxStr);
  const cellW = (maxLon - minLon) / gridSize;
  const cellH = (maxLat - minLat) / gridSize;

  const counts = Array.from({ length: gridSize }, () =>
    new Array(gridSize).fill(0)
  );
  const centroids: [number, number][] = [];

  for (const f of features) {
    if (f.geometry?.type === "Polygon") {
      const coords = f.geometry.coordinates as number[][][];
      centroids.push(computePolygonCentroid(coords));
    }
  }

  for (const [lon, lat] of centroids) {
    if (lon < minLon || lon > maxLon || lat < minLat || lat > maxLat) continue;
    const x = Math.min(Math.floor((lon - minLon) / cellW), gridSize - 1);
    const y = Math.min(Math.floor((lat - minLat) / cellH), gridSize - 1);
    counts[y][x]++;
  }

  let max = -1,
    maxX = 0,
    maxY = 0;
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (counts[y][x] > max) {
        max = counts[y][x];
        maxX = x;
        maxY = y;
      }
    }
  }

  const cellMinLon = minLon + maxX * cellW;
  const cellMinLat = minLat + maxY * cellH;
  const cellMaxLon = cellMinLon + cellW;
  const cellMaxLat = cellMinLat + cellH;

  const densestPolygon: Feature = {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [cellMinLon, cellMinLat],
          [cellMaxLon, cellMinLat],
          [cellMaxLon, cellMaxLat],
          [cellMinLon, cellMaxLat],
          [cellMinLon, cellMinLat],
        ],
      ],
    },
    properties: { density: max, gridSize },
  } as Feature;

  return { densestPolygon, count: max };
};
