import {RootState} from 'lib/redux/store';
import {createSelector} from 'reselect';
import {User} from 'typings/auth';
import {AuthState} from './authSlice';

export const getAuthState = (state: RootState): AuthState => state.auth;

export const getUser: (state: RootState) => User | undefined =
(state: RootState): User | undefined => state.auth.user;
export const getIsLoading = (state: RootState): boolean => state.auth.loading;
export const getSignUpRequestSent = (state: RootState): boolean =>
  state.auth.signUpRequestSent;

export const getIsLoggedIn = createSelector(
  [getUser],
  (user) => user !== undefined,
);
