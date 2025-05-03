import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ImageUploadState {
  images: Image[]; 
  loading: boolean;
  error: string | null;
  message: string | null
}

export interface Image {
    _id: string; 
    creator: string; 
    imageId: string;
    imageName: string;
    image: string; 

  }

export const initialState: ImageUploadState = {
  images: [],
  loading: false,
  error: null,
  message:null
};

const imagesSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {

    fetchImagesStart(state) {
        state.loading = true;
        state.error = null;
        state.message = null
      },

      fetchImagesSuccess(state, action: PayloadAction<Image[]>) { 
        state.loading = false;
        state.images = action.payload.reverse(); 
      },

    uploadImageStart(state) {
      state.loading = true; 
      state.error = null;
      state.message= null;
     
    },
    uploadImageSuccess(state,action:PayloadAction<string>) {
     
      state.loading = false;
      state.message = action.payload

    },
    uploadImageFailure(state, action: PayloadAction<string>) {
      
      state.loading = false;
      state.error = action.payload
      state.message = null
    },
  },
});

export const { uploadImageStart, uploadImageSuccess, uploadImageFailure,fetchImagesStart, fetchImagesSuccess } = imagesSlice.actions;
export default imagesSlice.reducer;