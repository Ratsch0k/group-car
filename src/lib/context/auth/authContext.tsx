import React, {useState, useEffect} from 'react';
import axios from 'axios';
import checkLoggedIn from 'util/requests/checkLoggedIn';

export interface IUser {
  username: string;
  email: string;
  isBetaUser: boolean;
}

type AxiosPromise = import('axios').AxiosPromise;
type AxiosResponse = import('axios').AxiosResponse;
type Request = Promise<AxiosPromise | AxiosResponse>

export interface IAuthContext {
  login(username: string, password: string): Request;
  logout(): Request;
  user: IUser | undefined;
  isLoggedIn: boolean;
}

const AuthContext = React.createContext<IAuthContext>({
  login: () => Promise.reject(new Error()),
  logout: () => Promise.reject(new Error()),
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
    return axios.put('/auth/login', {username, password}).then((res) => {
      setUser(res.data);
      setIsLoggedIn(true);
      return res;
    });
  };

  const logout = (): Request => {
    setUser(undefined);
    setIsLoggedIn(false);
    return Promise.reject(new Error('Not yet implemented'));
  };

  return (
    <AuthContext.Provider value={{login, logout, user, isLoggedIn}}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
