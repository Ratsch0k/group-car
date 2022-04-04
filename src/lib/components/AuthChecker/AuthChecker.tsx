import React, {useEffect, useCallback, useState} from 'react';
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
import {getLocation, push} from 'connected-react-router';
import {unwrapResult} from '@reduxjs/toolkit';

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
  const {pathname} = useShallowAppSelector(getLocation);
  const [checkedSession, setCheckedSession] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoggedIn && !pathname.startsWith('/auth') && checkedSession) {
      dispatch(push('/auth'));
    }
  }, [isLoggedIn, pathname, checkedSession]);

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
      dispatch(push('/auth'));
    }
    return Promise.reject(error);
  }, [user, isLoggedIn]);

  const removeLoader = useCallback(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.style.opacity = '0';
    }

    // Remove loading spinner from DOM after it faded out
    const timeout = setTimeout(() => {
      if (loader) {
        loader.remove();
      }
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

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
    const initialLogInCheck = async () => {
      try {
        unwrapResult(await dispatch(checkLoggedInThunk()));
      } catch {
        // Ignore
      } finally {
        removeLoader();
        setCheckedSession(true);
      }
    };

    initialLogInCheck();
  }, []);

  return (
    <React.Fragment>
      {props.children}
    </React.Fragment>
  );
};

export default AuthChecker;
