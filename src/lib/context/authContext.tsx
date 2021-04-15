import React, {useEffect, useCallback} from 'react';
import axios from 'lib/client';
import {AxiosError} from 'axios';
import {useAppDispatch, useAppSelector} from 'lib/redux/hooks';
import {
  setUser,
} from 'lib/redux/slices/auth/authSlice';
import {
  checkLoggedIn as checkLoggedInThunk,
} from 'lib/redux/slices/auth/authThunks';
import {
  getUser,
  getIsLoggedIn,
} from 'lib/redux/slices/auth/authSelectors';


export const AuthChecker: React.FC = (props) => {
  const user = useAppSelector(getUser);
  const isLoggedIn = useAppSelector(getIsLoggedIn);
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

  return (
    <React.Fragment>
      {props.children}
    </React.Fragment>
  );
};

export default AuthChecker;
