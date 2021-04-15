import {RootState} from 'lib/redux/store';
import {User} from 'typings/auth';

export const getIsLoggedIn = (state: RootState): boolean =>
  state.auth.user !== undefined;
export const getUser = (state: RootState): User | undefined => state.auth.user;
export const getIsLoading = (state: RootState): boolean => state.auth.loading;
export const getSignUpRequestSent = (state: RootState): boolean =>
  state.auth.signUpRequestSent;
