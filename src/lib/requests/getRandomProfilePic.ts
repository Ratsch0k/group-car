import axios from 'axios';

type Request = import('./request').Request;

/**
 * Gets a random profile picture for the given username and offset.
 * @param username  The username for which to generate the profile pic
 * @param offset    The offset which to use to generate
 * @return          The http request and a method to cancel it
 */
const getRandomProfilePic = (username: string, offset?: number): Request => {
  if (!username || username.length <= 0) {
    return {
      request: Promise.reject(new Error('Invalid arguments')),
      cancel: () => {},
    };
  }

  const source = axios.CancelToken.source();

  const request = axios.get('/user/generate-profile-pic', {
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
