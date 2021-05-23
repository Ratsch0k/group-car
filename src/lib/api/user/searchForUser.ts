import Axios from 'axios';
import {Request, AxiosType} from 'lib';
import {UserSimple} from 'typings';

export interface SearchForUserResponse {
  users: UserSimple[];
}
export type SearchForUserRequest = Request<SearchForUserResponse>;
export type SearchForUser = (
  usernameStart: string,
) => SearchForUserRequest;

/**
 * Searches for users which start with the start with the specified string.
 * @param usernameStart The string to search for
 * @param axios - If provided the method will use this instance of axios
 *    instead of the default one.
 */
export const searchForUser: SearchForUser = (
  usernameStart,
  axios: AxiosType = Axios,
) => {
  return axios.get(`/api/user/search?filter=${usernameStart}`);
};

export default searchForUser;
