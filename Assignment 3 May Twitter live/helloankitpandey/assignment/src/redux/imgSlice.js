import { createSlice } from "@reduxjs/toolkit";

// intial imageList -> null
const initialState = {
  imageList: [],
};

// Now making slice of images
const imageSlice = createSlice({
  name: "images",
  initialState,
  // reducers of imageSlice
  reducers: {
    addImage: (state, action) => {
      state.imageList.push(action.payload);
    },
    clearImages: (state) => {
      // deleting all images
      state.imageList = [];
    },
  },
});


export const { addImage, clearImages } = imageSlice.actions;
export default imageSlice.reducer;
