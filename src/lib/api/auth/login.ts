import {Request} from 'lib';
import axios from 'lib/client';
import {User} from 'typings';

export type LoginRequest = Request<User>;
/**
 * Type for login.
 */
export type Login = (username: string, password: string) => LoginRequest;

/**
 * Sends a login request to the backend with the given
 * arguments.\
 * If any arguments is either undefined/null or an empty string
 * the request will not be send and will return a rejected promise.
 * @param username  Username to sign up with
 * @param password  The password for the account
 * @return          The request and a method to cancel it
 */
export const login: Login = (
  username,
  password,
): LoginRequest => {
  // Check if provided arguments are non empty strings
  if (!username || username.length <= 0 ||
    !password || password.length <= 0) {
    throw new TypeError('Parameters invalid');
  }

  return axios.put(
    '/auth/login',
    {
      username,
      password,
    },
  );
};
