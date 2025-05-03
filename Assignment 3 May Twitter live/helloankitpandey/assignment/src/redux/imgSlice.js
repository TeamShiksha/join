import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  imageList: [],
};

const imageSlice = createSlice({
  name: "images",
  initialState,
  reducers: {
    addImage: (state, action) => {
      state.imageList.push(action.payload);
    },
    clearImages: (state) => {
      state.imageList = [];
    },
  },
});

export const { addImage, clearImages } = imageSlice.actions;
export default imageSlice.reducer;
