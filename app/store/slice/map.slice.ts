import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Geometry } from "geojson";
import { Feature as GeoFeature } from "geojson";

// Types
interface Feature {
  id: number;
  geometry: Geometry;
  properties: Record<string, unknown>;
}

export type IMainFeature = Feature;

interface MapState {
  features: [];
  selectedFeature: GeoFeature | null;
  hoveredFeature: GeoFeature | null;
  zoomToFeature: GeoFeature | null;
  toggleMavView: boolean;
}

const initialState: MapState = {
  features: [],
  selectedFeature: null,
  hoveredFeature: null,
  zoomToFeature: null,
  toggleMavView: true,
};

export const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setFeatures(state, action: PayloadAction<GeoFeature[]>) {
      state.features = action.payload as unknown as [];
    },
    setSelectedFeature(state, action: PayloadAction<GeoFeature | null>) {
      state.selectedFeature = action.payload;
    },
    setHoveredFeature(state, action: PayloadAction<GeoFeature | null>) {
      state.hoveredFeature = action.payload;
    },
    setZoomToFeature(state, action: PayloadAction<GeoFeature | null>) {
      state.zoomToFeature = action.payload;
    },
    setToggleMapView(state, action: PayloadAction<boolean>) {
      state.toggleMavView = action.payload;
    },
  },
});

export const {
  setFeatures,
  setSelectedFeature,
  setHoveredFeature,
  setZoomToFeature,
  setToggleMapView,
} = mapSlice.actions;
