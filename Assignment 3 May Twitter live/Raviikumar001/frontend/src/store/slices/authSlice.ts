import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../store';


interface AuthState {
  isLoggedIn: boolean;
  user: User | null; 
  token: string | null;
  loading: boolean;
  error: string | null;
}

type Payload = {
    user :User,
    token: string
}

export const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state)
    {
        state.loading = true;
        state.error = null;
    },
    defaultState(state){
      state.loading = false;
      state.error = null;
     
    },
    loginSuccess(state,action: PayloadAction<Payload>) {
        state.isLoggedIn = true;
        state.loading = false;
        state.user = action.payload.user
        state.token = action.payload.token
        localStorage.setItem('user', JSON.stringify(action.payload.user)); 
        localStorage.setItem('token', JSON.stringify(action.payload.token)); 
    },
    loginFailure(state, action: PayloadAction<string>){
        state.loading = false;
     
        state.error = action.payload;
    },


    registerStart(state) {
      state.loading = true;
      state.error = null;
    },
    registerSuccess(state,action: PayloadAction<Payload>) {

      state.isLoggedIn = true;
      state.loading = false;
      state.user = action.payload.user
      state.token = action.payload.token
      localStorage.setItem('user', JSON.stringify(action.payload.user)); 
      localStorage.setItem('token', JSON.stringify(action.payload.token)); 
    },
    registerFailure(state, action: PayloadAction<string>) {
      state.loading = false;
     
        state.error = action.payload;
    },

    logout() {
       
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    
  },
});

export const { registerStart, registerSuccess, registerFailure,
    loginFailure,
    loginStart,
    loginSuccess,
    logout,
    defaultState
    
    
    
   } = authSlice.actions;
export default authSlice.reducer;