import { configureStore } from "@reduxjs/toolkit";
import { mapSlice } from "./slice/map.slice";
import { mapSlice2 } from "./slice/map_category.slice";

export const store = configureStore({
  reducer: {
    map: mapSlice.reducer,
    map_many: mapSlice2.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
