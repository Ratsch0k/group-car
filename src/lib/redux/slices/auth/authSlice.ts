import {
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import {User} from 'typings/auth';

import {isCompletedMatcher, isPendingMatcher} from 'lib/redux/util';

export interface AuthState {
  user: User | undefined;
  loading: boolean;
  signUpRequestSent: boolean;
}

export const initialState: AuthState = {
  loading: false,
  user: undefined,
  signUpRequestSent: false,
};

const name = 'auth';

export const authSlice = createSlice({
  name: name,
  initialState,
  reducers: {
    reset(state) {
      state.loading = initialState.loading;
      state.user = initialState.user;
      state.signUpRequestSent = initialState.signUpRequestSent;
    },
    setUser(state, action: PayloadAction<User | undefined>) {
      state.user = action.payload;
    },
    setSignUpRequestSent(state, action: PayloadAction<boolean>) {
      state.signUpRequestSent = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(isPendingMatcher(name), (state) => {
      state.loading = true;
    }).addMatcher(isCompletedMatcher(name), (state) => {
      state.loading = false;
    });
  },
});

export const {setUser, setSignUpRequestSent, reset} = authSlice.actions;
export default authSlice.reducer;
