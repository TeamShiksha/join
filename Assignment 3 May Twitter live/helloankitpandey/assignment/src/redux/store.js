import { configureStore } from "@reduxjs/toolkit";
import imageReducer from "./imgSlice";

// making store for state
export const store = configureStore({
  // reducer is like fn
  // which handles events
  reducer: {
    images: imageReducer,
  },
});
