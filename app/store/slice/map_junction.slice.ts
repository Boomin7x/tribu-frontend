import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Feature } from "geojson";

export interface MapJunctionState {
  features: Feature[] | null;
  selectedFeature: Feature | null;
  hoveredFeature: Feature | null;
  zoomToFeature: Feature | null;
  toggleJunctionView: boolean;
}

const createInitialJunctionState = (): MapJunctionState => ({
  features: [],
  selectedFeature: null,
  hoveredFeature: null,
  zoomToFeature: null,
  toggleJunctionView: false,
});

const initialMapJunctionState: Record<string, MapJunctionState | undefined> =
  {};

export const mapJunctionSlice = createSlice({
  name: "map_junction",
  initialState: initialMapJunctionState,
  reducers: {
    setJunctionFeatures(
      state,
      action: PayloadAction<{ category: string; features: Feature[] | null }>
    ) {
      const { category, features } = action.payload;
      if (!state[category]) {
        state[category] = createInitialJunctionState();
      }
      state[category].features = features;
    },
    setSelectedJunctionFeature(
      state,
      action: PayloadAction<{ category: string; feature: Feature | null }>
    ) {
      const { category, feature } = action.payload;
      if (!state[category]) {
        state[category] = createInitialJunctionState();
      }
      state[category].selectedFeature = feature;
    },
    setHoveredJunctionFeature(
      state,
      action: PayloadAction<{ category: string; feature: Feature | null }>
    ) {
      const { category, feature } = action.payload;
      if (!state[category]) {
        state[category] = createInitialJunctionState();
      }
      state[category].hoveredFeature = feature;
    },
    setZoomToJunctionFeature(
      state,
      action: PayloadAction<{ category: string; feature: Feature | null }>
    ) {
      const { category, feature } = action.payload;
      if (!state[category]) {
        state[category] = createInitialJunctionState();
      }
      state[category].zoomToFeature = feature;
    },
    setToggleJunctionView(
      state,
      action: PayloadAction<{ category: string; isOpen: boolean }>
    ) {
      const { category, isOpen } = action.payload;
      if (!state[category]) {
        state[category] = createInitialJunctionState();
      }
      state[category].toggleJunctionView = isOpen;
    },
  },
});

export const {
  setJunctionFeatures,
  setSelectedJunctionFeature,
  setHoveredJunctionFeature,
  setZoomToJunctionFeature,
  setToggleJunctionView,
} = mapJunctionSlice.actions;
