import React, {useState, useEffect, useCallback} from 'react';
import {
  LoginRequest,
  LogOutRequest,
  NotDefinedError,
  SignUpRequest,
  User,
} from 'lib';
import {AxiosError, AxiosResponse} from 'axios';
import {useAxios, useModalRouter} from 'lib/hooks';
import {useApi} from 'lib/hooks/useApi';
import {useHistory} from 'react-router-dom';

export interface IUser {
  username: string;
  email: string;
  isBetaUser: boolean;
  id: number;
}

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
  user: IUser | undefined;
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
  const [user, setUser] = useState<IUser | undefined>();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const {goTo} = useModalRouter();
  const api = useApi();
  const {axios} = useAxios();
  const history = useHistory();
  const errorHandler = useCallback((error: AxiosError) => {
    if (error.response &&
      error.response.data.detail &&
      error.response.data.detail.errorName === 'NotLoggedInError' &&
      isLoggedIn &&
      user !== undefined
    ) {
      setUser(undefined);
      setIsLoggedIn(false);
    }
    return Promise.reject(error);
  }, [user, isLoggedIn]);

  /**
   * Register response interceptor which
   * reacts to the NotLoggedInError and
   * logs the user out.
   */
  useEffect(() => {
    axios.then((axiosInstance) => {
      axiosInstance.interceptors.response.use((response) => {
        return response;
      }, errorHandler);
    });
  }, [axios, errorHandler]);

  // Send request which checks if client is logged in
  useEffect(() => {
    api.checkLoggedIn().then((res: AxiosResponse) => {
      setUser(res.data);
      setIsLoggedIn(true);
    }).catch(() => {
      setUser(undefined);
      setIsLoggedIn(false);
    });
    // eslint-disable-next-line
  }, []);

  const login = (
      username: string,
      password: string,
  ): LoginRequest => {
    const request = api.login(username, password);
    request.then((response) => {
      setUser(response.data);
      setIsLoggedIn(true);
      return response;
    });

    return request;
  };

  const signUp = (
      username: string,
      email: string,
      password: string,
      offset: number,
  ): SignUpRequest => {
    const request = api.signUp(
        username,
        email,
        password,
        offset,
    );

    request.then((response) => {
      if ((response.data as User).id) {
        setUser(response.data as User);
        setIsLoggedIn(true);
      }
      return response;
    });

    return request;
  };

  const logout = (): LogOutRequest => {
    const request = api.logout();

    request.then(() => {
      setUser(undefined);
      setIsLoggedIn(false);
      history.push('/');
    });

    return request;
  };

  const openAuthDialog = (): void => {
    goTo('/auth');
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
