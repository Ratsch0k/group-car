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

const name = 'auth';

export const authSlice = createSlice({
  name: name,
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
    builder.addMatcher(isPendingMatcher(name), (state) => {
      state.loading = true;
    }).addMatcher(isCompletedMatcher(name), (state) => {
      state.loading = false;
    });
  },
});

export const {setUser, setSignUpRequestSent} = authSlice.actions;
export default authSlice.reducer;
