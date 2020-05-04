import axios from 'axios';

type Request = import('./request').Request;

/**
 * Gets a random profile picture for the given username and offset.
 */
const getRandomProfilePic = (username: string, offset?: number): Request => {
  if (!username || username.length <= 0) {
    return {
      request: Promise.reject(new Error('Invalid arguments')),
      cancel: () => {},
    };
  }

  const source = axios.CancelToken.source();

  const request = axios.get('/user/generate-pb', {
    params: {
      username,
      offset,
    },
    cancelToken: source.token,
    responseType: 'blob',
  });

  return {
    request,
    cancel: source.cancel,
  };
};

export default getRandomProfilePic;
