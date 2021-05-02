import React, {useEffect, useCallback} from 'react';
import axios from 'lib/client';
import {AxiosError} from 'axios';
import {
  useAppDispatch,
  useAppSelector,
  useShallowAppSelector,
} from 'lib/redux/hooks';
import {
  checkLoggedIn as checkLoggedInThunk,
  getUser,
  getIsLoggedIn,
  reset,
} from 'lib/redux/slices/auth';

/**
 * Component for handling initial session check and logging out if
 * backend response with specified error.
 * @param props Only children
 * @returns Function component
 */
export const AuthChecker: React.FC = (props) => {
  const user = useShallowAppSelector(getUser);
  const isLoggedIn = useAppSelector(getIsLoggedIn);
  const dispatch = useAppDispatch();

  /**
   * Handles error messages.
   * If the error message is a NotLoggedInError,
   * it reset the authentication state.
   */
  const errorHandler = useCallback((error: AxiosError) => {
    if (error.response &&
      error.response.data.detail &&
      error.response.data.detail.errorName === 'NotLoggedInError' &&
      isLoggedIn &&
      user !== undefined
    ) {
      dispatch(reset());
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
