import React, {useEffect, useCallback} from 'react';
import {
  LoginRequest,
  LogOutRequest,
  NotDefinedError,
  SignUpRequest,
} from 'lib';
import axios from 'lib/client';
import {AxiosError} from 'axios';
import {User} from 'typings/auth';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {
  login as loginThunk,
  logout as logoutThunk,
  signUp as signUpThunk,
  checkLoggedIn as checkLoggedInThunk,
  getUser,
  isLoggedIn as isLoggedInSelector,
  setUser,
} from 'redux/slices/auth/authSlice';
import {unwrapResult} from '@reduxjs/toolkit';
import {goTo} from 'redux/slices/modalRouter/modalRouterSlice';

export interface AuthContext {
  login(
    username: string,
    password: string,
  ): LoginRequest;
  logout(): LogOutRequest;
  signUp(
    username: string,
    email: string,
    password: string,
    offset: number,
  ): SignUpRequest;
  user: User | undefined;
  isLoggedIn: boolean;
  openAuthDialog(): void;
}

export const AuthContext = React.createContext<AuthContext>({
  login: () => Promise.reject(new NotDefinedError()),
  logout: () => Promise.reject(new NotDefinedError()),
  signUp: () => Promise.reject(new NotDefinedError()),
  user: undefined,
  isLoggedIn: false,
  openAuthDialog: () => undefined,
});
AuthContext.displayName = 'AuthContext';

export const AuthProvider: React.FC = (props) => {
  const user = useAppSelector(getUser);
  const isLoggedIn = useAppSelector(isLoggedInSelector);
  const dispatch = useAppDispatch();
  const errorHandler = useCallback((error: AxiosError) => {
    if (error.response &&
      error.response.data.detail &&
      error.response.data.detail.errorName === 'NotLoggedInError' &&
      isLoggedIn &&
      user !== undefined
    ) {
      setUser(undefined);
    }
    return Promise.reject(error);
  }, [user, isLoggedIn]);

  /**
   * Register response interceptor which
   * reacts to the NotLoggedInError and
   * logs the user out.
   */
  useEffect(() => {
    axios.interceptors.response.use((response) => {
      return response;
    }, errorHandler);
  }, [errorHandler]);

  // Send request which checks if client is logged in
  useEffect(() => {
    dispatch(checkLoggedInThunk());
    // eslint-disable-next-line
  }, []);

  const login = async (
    username: string,
    password: string,
  ): LoginRequest => {
    const res = await dispatch(loginThunk({username, password}));
    return unwrapResult(res);
  };

  const signUp = async (
    username: string,
    email: string,
    password: string,
    offset: number,
  ): SignUpRequest => {
    const res = await dispatch(signUpThunk({
      username,
      email,
      password,
      offset,
    }));

    return unwrapResult(res);
  };

  const logout = async (): LogOutRequest => {
    return unwrapResult(await dispatch(logoutThunk()));
  };

  const openAuthDialog = (): void => {
    dispatch(goTo('/auth'));
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        signUp,
        user,
        isLoggedIn,
        openAuthDialog,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
