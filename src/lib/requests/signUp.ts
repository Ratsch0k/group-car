import axios from 'axios';

type Request = import('./request').Request;

/**
 * Sends a sign up request to the backend with the given
 * arguments.\
 * If any arguments is either undefined/null or an empty string
 * the request will not be send and will return a rejected promise.
 * @param username  Username to sign up with
 * @param email     Email of the user
 * @param password  The password for the account
 */
const signUp = (
    username: string,
    email: string,
    password: string,
    offset: number,
): Request => {
  // Check if provided arguments are non empty strings
  if (!username || username.length <= 0 ||
    !email || email.length <= 0 ||
    !password || password.length <= 0) {
    return {
      request: Promise.reject(new Error('Request invalid')),
      cancel: () => {},
    };
  }


  const source = axios.CancelToken.source();

  const request = axios.put(
      '/auth/sign-up',
      {
        username,
        email,
        password,
        offset,
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

export default signUp;

