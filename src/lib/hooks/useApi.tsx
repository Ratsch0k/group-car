import {useAxios} from 'lib';
import {
  checkLoggedIn,
  CheckLoggedIn,
  Login,
  login,
  signUp,
  SignUp,
  logout,
  LogOut,
} from 'lib/api';

/**
 * Api calls.
 */
export interface Api {
  checkLoggedIn: CheckLoggedIn;
  /**
   * {@link login}
   */
  login: Login;
  logout: LogOut;
  signUp: SignUp;
}

/**
 * Hook for providing api calls.
 */
export const useApi = (): Api => {
  const {axios} = useAxios();

  const wrapCall = <T extends unknown>(call: T): T => {
    return ((...params: unknown[]) =>
        axios.then((axios) =>
          (call as (...params: unknown[]) => T)(...params, axios)) as T) as T;
  };

  return {
    checkLoggedIn: wrapCall(checkLoggedIn),
    login: wrapCall(login),
    signUp: wrapCall(signUp),
    logout: wrapCall(logout),
  };
};
