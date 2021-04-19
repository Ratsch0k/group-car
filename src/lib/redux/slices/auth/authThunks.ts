import {createAsyncThunk} from '@reduxjs/toolkit';
import {AxiosError} from 'axios';
import {CallHistoryMethodAction, replace} from 'connected-react-router';
import {RestError, User} from 'lib';
import {goToModal} from '../modalRouter/modalRouterSlice';
import {setUser, setSignUpRequestSent, reset} from './authSlice';
import {
  login as loginApi,
  logout as logoutApi,
  signUp as signUpApi,
  checkLoggedIn as checkLoggedInApi,
} from 'lib/api';
import {reset as resetGroup} from '../group';
import {reset as resetInvites} from '../invites';

export interface LoginParams {
  username: string;
  password: string;
}
/**
 * Logs in with username and password.
 * If successful the user will be set.
 */
export const login = createAsyncThunk(
  'auth/login',
  async (data: LoginParams, {dispatch, rejectWithValue}) => {
    try {
      const res = await loginApi(data.username, data.password);

      dispatch(setUser(res.data));
      dispatch(setSignUpRequestSent(false));
      return res.data;
    } catch (e) {
      const error = e as AxiosError<RestError>;
      return rejectWithValue(error.response?.data);
    }
  },
);

/**
 * Logs out. If successful, the user will be set to undefined.
 */
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, {dispatch, rejectWithValue}) => {
    try {
      await logoutApi();
      // Reset state all reducers which required a logged in user
      dispatch(reset());
      dispatch(resetGroup());
      dispatch(resetInvites());
      dispatch(replace('/'));
    } catch (e) {
      const error = e as AxiosError<RestError>;
      return rejectWithValue(error.response?.data);
    }
  },
);

export interface SignUpParams {
  username: string;
  email: string;
  password: string;
  offset: number;
}
/**
 * Creates a new user account by signing in.
 * The request can be successful in two different ways.
 *  1. The backend allows direct sign up requests.
 *      The user account will be created and the user will be set
 *  2. The backend doesn't allow direct sign up requests.
 *      The user will not be changed, but the `signUpRequestSent` field
 *      in the state will be set to true.
 */
export const signUp = createAsyncThunk(
  'auth/signUp',
  async (data: SignUpParams, {dispatch, rejectWithValue}) => {
    try {
      const res = await signUpApi(
        data.username,
        data.email,
        data.password,
        data.offset,
      );

      if ((res.data as User).id) {
        dispatch(setUser(res.data as User));
        dispatch(setSignUpRequestSent(false));
      } else {
        dispatch(setSignUpRequestSent(true));
      }

      return res.data;
    } catch (e) {
      const error = (e as AxiosError<RestError>).response?.data;
      return rejectWithValue(error);
    }
  },
);

/**
 * Checks if the session is still valid and will log the user in if it is.
 */
export const checkLoggedIn = createAsyncThunk(
  'auth/checkLoggedIn',
  async (_, {dispatch, rejectWithValue}) => {
    try {
      const res = await checkLoggedInApi();
      dispatch(setUser(res.data));
      return res.data;
    } catch (e) {
      dispatch(setUser(undefined));
      const error = (e as AxiosError<RestError>).response?.data;
      return rejectWithValue(error);
    }
  },
);

/**
 * Opens the authentication dialog.
 * @returns The action to open the auth dialog.
 */
export const openAuthDialog = (): CallHistoryMethodAction<unknown> =>
  goToModal('/auth');
