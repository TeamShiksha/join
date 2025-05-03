import { configureStore } from "@reduxjs/toolkit";
import imageReducer from "./imgSlice";

export const store = configureStore({
  reducer: {
    images: imageReducer,
  },
});
