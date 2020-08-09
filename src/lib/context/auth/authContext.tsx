import React, {useState, useEffect} from 'react';
import checkLoggedIn from 'lib/requests/checkLoggedIn';
import loginRequest from 'lib/requests/login';
import logoutRequest from 'lib/requests/logout';
import signUpRequest from 'lib/requests/signUp';

export interface IUser {
  username: string;
  email: string;
  isBetaUser: boolean;
  id: number;
}

type AxiosPromise = import('axios').AxiosPromise;
type AxiosResponse = import('axios').AxiosResponse;
type Request = Promise<AxiosPromise | AxiosResponse>

export interface IAuthContext {
  login(username: string, password: string): Request;
  logout(): Request;
  signUp(
    username: string,
    email: string,
    password: string,
    offset: number,
  ): Request;
  user: IUser | undefined;
  isLoggedIn: boolean;
}

const AuthContext = React.createContext<IAuthContext>({
  login: () => Promise.reject(new Error()),
  logout: () => Promise.reject(new Error()),
  signUp: () => Promise.reject(new Error()),
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

  const login = (username: string, password: string): Request => {
    return loginRequest(username, password).request.then((res) => {
      setUser(res.data);
      setIsLoggedIn(true);
      return res;
    });
  };

  const signUp = (
      username: string,
      email: string,
      password: string,
      offset: number,
  ): Request => {
    return signUpRequest(
        username,
        email,
        password,
        offset,
    ).request.then((res) => {
      setUser(res.data);
      setIsLoggedIn(true);
      return res;
    });
  };

  const logout = (): Request => {
    return logoutRequest().request.then((res) => {
      setUser(undefined);
      setIsLoggedIn(false);
      return res;
    });
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
