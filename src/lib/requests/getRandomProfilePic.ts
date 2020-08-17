import axios from 'axios';
import {Request} from './request';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GetRandomProfilePicRequest = Request<any>;

/**
 * Gets a random profile picture for the given username and offset.
 * @param username  The username for which to generate the profile pic
 * @param offset    The offset which to use to generate
 * @return          The http request and a method to cancel it
 */
export const getRandomProfilePic = (
    username: string,
    offset?: number,
): GetRandomProfilePicRequest => {
  if (!username || username.length <= 0) {
    return {
      request: Promise.reject(new Error('Invalid arguments')),
      cancel: () => undefined,
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
