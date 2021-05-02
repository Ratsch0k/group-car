import axiosStatic from 'axios';
import {Request} from 'lib';
import {User} from 'typings';
import {AxiosType} from '../request';


export interface SignUpRequestResponse {
  message: string;
}

export type SignUpResponse = User | SignUpRequestResponse;

export type SignUpRequest = Request<SignUpResponse>;
export type SignUp = (
  username: string,
  email: string,
  password: string,
  offset: number,
) => SignUpRequest;

/**
 * Sends a sign up request to the backend with the given
 * arguments.\
 * If any arguments is either undefined/null or an empty string
 * the request will not be send and will return a rejected promise.
 * @param username  Username to sign up with
 * @param email     Email of the user
 * @param password  The password for the account
 * @param offset    The offset with which the profile picture can be generated
 * @return          The request and a method to cancel it
 */
export const signUp: SignUp = (
  username: string,
  email: string,
  password: string,
  offset: number,
  axios: AxiosType = axiosStatic,
) => {
  // Check if provided arguments are non empty strings
  if (!username || username.length <= 0 ||
    !email || email.length <= 0 ||
    !password || password.length <= 0) {
    return Promise.reject(
      new TypeError('All parameters have to be a non-empty string'),
    );
  }

  return axios.post<SignUpResponse>(
    '/auth/sign-up',
    {
      username,
      email,
      password,
      offset,
    },
  );
};
