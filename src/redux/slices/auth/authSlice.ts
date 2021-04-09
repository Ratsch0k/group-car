import {createSlice} from '@reduxjs/toolkit';
import {RootState} from 'redux/store';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    loggedIn: false,
  },
  reducers: {
    login: (state) => {
      state.loggedIn = true;
    },
    logout: (state) => {
      state.loggedIn = false;
    },
  },
});

export const {login, logout} = authSlice.actions;

export const authSelector = (state: RootState): boolean => state.auth.loggedIn;

export default authSlice.reducer;
