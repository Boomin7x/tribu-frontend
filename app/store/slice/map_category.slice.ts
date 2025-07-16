import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Feature } from "geojson";

export interface MapCategoryState {
  features: Feature[] | null;
  selectedFeature: Feature | null;
  hoveredFeature: Feature | null;
  zoomToFeature: Feature | null;
  toggleMavView: boolean;
}

const createInitialCategoryState = (): MapCategoryState => ({
  features: [],
  selectedFeature: null,
  hoveredFeature: null,
  zoomToFeature: null,
  toggleMavView: true,
});

// export interface IMapCategoryState {
//   [category: string]: MapCategoryState | undefined;
// }

const initialMapCategoryState: Record<string, MapCategoryState | undefined> =
  {};

export const mapSlice2 = createSlice({
  name: "map_category",
  initialState: initialMapCategoryState,
  reducers: {
    setFeatures(
      state,
      action: PayloadAction<{ category: string; features: Feature[] | null }>
    ) {
      const { category, features } = action.payload;
      if (!state[category]) {
        state[category] = createInitialCategoryState();
      }
      state[category].features = features;
    },

    setSelectedFeature(
      state,
      action: PayloadAction<{ category: string; feature: Feature | null }>
    ) {
      const { category, feature } = action.payload;
      if (!state[category]) {
        state[category] = createInitialCategoryState();
      }
      state[category].selectedFeature = feature;
    },

    setHoveredFeature(
      state,
      action: PayloadAction<{ category: string; feature: Feature | null }>
    ) {
      const { category, feature } = action.payload;
      if (!state[category]) {
        state[category] = createInitialCategoryState();
      }
      state[category].hoveredFeature = feature;
    },

    setZoomToFeature(
      state,
      action: PayloadAction<{ category: string; feature: Feature | null }>
    ) {
      const { category, feature } = action.payload;
      if (!state[category]) {
        state[category] = createInitialCategoryState();
      }
      state[category].zoomToFeature = feature;
    },

    setToggleMapView(
      state,
      action: PayloadAction<{ category: string; isOpen: boolean }>
    ) {
      const { category, isOpen } = action.payload;
      if (!state[category]) {
        state[category] = createInitialCategoryState();
      }
      state[category].toggleMavView = isOpen;
    },
  },
});

export const {
  setFeatures,
  setSelectedFeature,
  setHoveredFeature,
  setZoomToFeature,
  setToggleMapView,
} = mapSlice2.actions;
