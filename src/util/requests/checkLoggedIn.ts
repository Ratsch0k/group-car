import axios from 'axios';

type Request = import('./request').Request;

const checkLoggedIn = (): Request => {
  const source = axios.CancelToken.source();

  const request = axios.put('/auth/token', undefined, {
    cancelToken: source.token,
  });

  return {
    request,
    cancel: source.cancel,
  };
};

export default checkLoggedIn;
