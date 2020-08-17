import React, {useState, useEffect} from 'react';
import checkLoggedIn from 'lib/requests/checkLoggedIn';
import loginRequest, {LoginRequest} from 'lib/requests/login';
import logoutRequest, {LogOutRequest} from 'lib/requests/logout';
import signUpRequest, {
  SignUpRequest,
  SignUpAcceptedResponse,
} from 'lib/requests/signUp';
import {AxiosResponse} from 'axios';

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
}

const AuthContext = React.createContext<IAuthContext>({
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
});

export const AuthProvider: React.FC = (props) => {
  const [user, setUser] = useState<IUser | undefined>();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

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
      if ((response.data as SignUpAcceptedResponse).id) {
        setUser(response.data as SignUpAcceptedResponse);
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

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        signUp,
        user,
        isLoggedIn,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
