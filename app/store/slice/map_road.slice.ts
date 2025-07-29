import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Feature } from "geojson";

export interface MapRoadState {
  features: Feature[] | null;
  selectedFeature: Feature | null;
  hoveredFeature: Feature | null;
  zoomToFeature: Feature | null;
  toggleRoadView: boolean;
}

const createInitialRoadState = (): MapRoadState => ({
  features: [],
  selectedFeature: null,
  hoveredFeature: null,
  zoomToFeature: null,
  toggleRoadView: false, // Changed default to false
});

const initialMapRoadState: Record<string, MapRoadState | undefined> = {};

export const mapRoadSlice = createSlice({
  name: "map_road",
  initialState: initialMapRoadState,
  reducers: {
    setRoadFeatures(
      state,
      action: PayloadAction<{ category: string; features: Feature[] | null }>
    ) {
      const { category, features } = action.payload;
      if (!state[category]) {
        state[category] = createInitialRoadState();
      }
      state[category].features = features;
    },

    setSelectedRoadFeature(
      state,
      action: PayloadAction<{ category: string; feature: Feature | null }>
    ) {
      const { category, feature } = action.payload;
      if (!state[category]) {
        state[category] = createInitialRoadState();
      }
      state[category].selectedFeature = feature;
    },

    setHoveredRoadFeature(
      state,
      action: PayloadAction<{ category: string; feature: Feature | null }>
    ) {
      const { category, feature } = action.payload;
      if (!state[category]) {
        state[category] = createInitialRoadState();
      }
      state[category].hoveredFeature = feature;
    },

    setZoomToRoadFeature(
      state,
      action: PayloadAction<{ category: string; feature: Feature | null }>
    ) {
      const { category, feature } = action.payload;
      if (!state[category]) {
        state[category] = createInitialRoadState();
      }
      state[category].zoomToFeature = feature;
    },

    setToggleRoadView(
      state,
      action: PayloadAction<{ category: string; isOpen: boolean }>
    ) {
      const { category, isOpen } = action.payload;
      if (!state[category]) {
        state[category] = createInitialRoadState();
      }
      state[category].toggleRoadView = isOpen;
    },

    // New action to initialize road states from URL parameters
    initializeRoadStatesFromURL(
      state,
      action: PayloadAction<{ categories: string[] }>
    ) {
      const { categories } = action.payload;
      categories.forEach((category) => {
        if (!state[category]) {
          state[category] = createInitialRoadState();
        }
        state[category].toggleRoadView = true;
      });
    },
  },
});

export const {
  setRoadFeatures,
  setSelectedRoadFeature,
  setHoveredRoadFeature,
  setZoomToRoadFeature,
  setToggleRoadView,
  initializeRoadStatesFromURL,
} = mapRoadSlice.actions;
