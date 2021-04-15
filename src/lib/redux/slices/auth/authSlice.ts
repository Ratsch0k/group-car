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

const initialState: AuthState = {
  loading: false,
  user: undefined,
  signUpRequestSent: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | undefined>) {
      state.user = action.payload;
    },
    setSignUpRequestSent(state, action: PayloadAction<boolean>) {
      state.signUpRequestSent = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(isPendingMatcher, (state) => {
      state.loading = true;
    }).addMatcher(isCompletedMatcher, (state) => {
      state.loading = false;
    });
  },
});

export const {setUser, setSignUpRequestSent} = authSlice.actions;
export default authSlice.reducer;
