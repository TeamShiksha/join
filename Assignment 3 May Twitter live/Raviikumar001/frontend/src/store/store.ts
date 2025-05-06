
import { configureStore } from '@reduxjs/toolkit';
import authReducer,{initialState} from './slices/authSlice'; 
import imageSlices from './slices/imageSlices';
export type User ={
    _id: string,
    email:string
}


const storedUser = localStorage.getItem('user');
const token = localStorage.getItem('token');
if (storedUser) {
  initialState.user = JSON.parse(storedUser);

}
if(token)
{
    initialState.token = token
}


export const store = configureStore({
  reducer: {
    auth: authReducer,
    image:imageSlices
  },
});




export type RootState = ReturnType<typeof store.getState>;