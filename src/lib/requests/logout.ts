import axios from 'axios';

type Request = import('./request').Request;

/**
 * Sends a logout request to the backend.
 * @return the request and a method to cancel it
 */
const logout = (): Request => {
  const source = axios.CancelToken.source();

  const request = axios.put(
      '/auth/logout',
      {
        cancelToken: source.token,
      },
  );

  return {
    request,
    cancel: source.cancel,
  };
};

export default logout;

