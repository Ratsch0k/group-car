import axios from 'axios';
import {User, Request} from 'lib';

export type LoginRequest = Request<User>;

/**
 * Sends a login request to the backend with the given
 * arguments.\
 * If any arguments is either undefined/null or an empty string
 * the request will not be send and will return a rejected promise.
 * @param username  Username to sign up with
 * @param password  The password for the account
 * @return          The request and a method to cancel it
 */
export const login = (username: string, password: string): LoginRequest => {
  // Check if provided arguments are non empty strings
  if (!username || username.length <= 0 ||
    !password || password.length <= 0) {
    return {
      request: Promise.reject(new Error('Request invalid')),
      cancel: () => undefined,
    };
  }


  const source = axios.CancelToken.source();

  const request = axios.put(
      '/auth/login',
      {
        username,
        password,
      },
      {
        cancelToken: source.token,
      },
  );

  return {
    request,
    cancel: source.cancel,
  };
};
