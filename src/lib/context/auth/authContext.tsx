import React, {useState, useEffect} from 'react';
import checkLoggedIn from 'lib/requests/checkLoggedIn';
import loginRequest from 'lib/requests/login';
import signUpRequest from 'lib/requests/signUp';
import {useLocation, useHistory} from 'react-router-dom';
import queryString from 'query-string';

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
  openAuthDialog(): void;
}

const AuthContext = React.createContext<IAuthContext>({
  login: () => Promise.reject(new Error()),
  logout: () => Promise.reject(new Error()),
  signUp: () => Promise.reject(new Error()),
  user: undefined,
  isLoggedIn: false,
  openAuthDialog: () => {},
});

export const AuthProvider: React.FC = (props) => {
  const location = useLocation();
  const history = useHistory();
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

  /**
   * Open the auth dialog by appending the location with the query
   * with auth
   */
  const openAuthDialog = () => {
    const path = location.pathname;
    const query = queryString.stringify(
        {
          ...queryString.parse(location.search),
          auth: '/',
        },
        {
          encode: false,
        },
    );
    history.push(path + '?' + query);
  };

  const logout = (): Request => {
    setUser(undefined);
    setIsLoggedIn(false);
    return Promise.reject(new Error('Not yet implemented'));
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        signUp,
        user,
        isLoggedIn,
        openAuthDialog}}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
