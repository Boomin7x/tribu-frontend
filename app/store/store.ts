import { configureStore } from "@reduxjs/toolkit";
import { mapSlice } from "./slice/map.slice";
import { mapSlice2 } from "./slice/map_category.slice";
import { mapRoadSlice } from "./slice/map_road.slice";
import { mapJunctionSlice } from "./slice/map_junction.slice";
import { globalBboxSlice } from "./slice/globalBbox.slice";

export const store = configureStore({
  reducer: {
    map: mapSlice.reducer,
    map_many: mapSlice2.reducer,
    map_road: mapRoadSlice.reducer,
    map_junction: mapJunctionSlice.reducer,
    globalBbox: globalBboxSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
