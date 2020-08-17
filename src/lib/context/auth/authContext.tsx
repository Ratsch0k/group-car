import React, {useState, useEffect} from 'react';
import {
  signUp as signUpRequest,
  login as loginRequest,
  LoginRequest,
  LogOutRequest,
  logout as logoutRequest,
  SignUpRequest,
  checkLoggedIn,
  User,
} from 'lib';
import {AxiosResponse} from 'axios';
import {useModalRouter} from 'lib/hooks';

export interface IUser {
  username: string;
  email: string;
  isBetaUser: boolean;
  id: number;
}

export interface IAuthContext {
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

export const AuthContext = React.createContext<IAuthContext>({
  login: () => ({
    request: Promise.reject(new Error('Not yet defined')),
    cancel: () => undefined,
  }),
  logout: () => ({
    request: Promise.reject(new Error('Not yet defined')),
    cancel: () => undefined,
  }),
  signUp: () => ({
    request: Promise.reject(new Error('Not yet defined')),
    cancel: () => undefined,
  }),
  user: undefined,
  isLoggedIn: false,
  openAuthDialog: () => undefined,
});

export const AuthProvider: React.FC = (props) => {
  const [user, setUser] = useState<IUser | undefined>();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const {goTo} = useModalRouter();

  // Send request which checks if client is logged in
  useEffect(() => {
    checkLoggedIn().request.then((res: AxiosResponse) => {
      setUser(res.data);
      setIsLoggedIn(true);
    });
  }, []);

  const login = (
      username: string,
      password: string,
  ): LoginRequest => {
    const request = loginRequest(username, password);
    request.request.then((response) => {
      setUser(response.data);
      setIsLoggedIn(true);
    });

    return request;
  };

  const signUp = (
      username: string,
      email: string,
      password: string,
      offset: number,
  ): SignUpRequest => {
    const request = signUpRequest(
        username,
        email,
        password,
        offset,
    );

    request.request.then((response) => {
      if ((response.data as User).id) {
        setUser(response.data as User);
        setIsLoggedIn(true);
      }
    });

    return request;
  };

  const logout = (): LogOutRequest => {
    const request = logoutRequest();

    request.request.then(() => {
      setUser(undefined);
      setIsLoggedIn(false);
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
