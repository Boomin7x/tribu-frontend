import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IGlobalBbox {
  bbox?: number[];
}
const initialGlobalBboxState: IGlobalBbox = {
  bbox: undefined,
};

export const globalBboxSlice = createSlice({
  name: "globalBbox",
  initialState: initialGlobalBboxState,
  reducers: {
    setGlobalBbox: (state, action: PayloadAction<IGlobalBbox>) => {
      state.bbox = action.payload.bbox;
    },
  },
});

export const { setGlobalBbox } = globalBboxSlice.actions;
