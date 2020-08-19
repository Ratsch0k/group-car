import {useAxios} from 'lib';
import {
  CheckLoggedIn,
  Login,
  SignUp,
  /* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
  logout as logoutCall,
  login as loginCall,
  signUp as signUpCall,
  checkLoggedIn as checkLoggedInCall,
  /* eslint-enable @typescript-eslint/no-unused-vars, no-unused-vars */
  LogOut,
} from 'lib/api';
import * as apiCalls from 'lib/api';

/**
 * Api calls.
 */
export interface Api {
  /**
   * @see checkLoggedInCall
   */
  checkLoggedIn: CheckLoggedIn;
  /**
   * @see loginCall
   */
  login: Login;
  /**
   * @see logoutCall
   */
  logout: LogOut;
  /**
   * @see signUpCall
   */
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

  const api: {[index: string]: unknown} = {};

  for (const [name, call] of Object.entries(apiCalls)) {
    api[name] = wrapCall(call);
  }

  return api as unknown as Api;
};
