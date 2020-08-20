import {Group, Request, AxiosType} from 'lib';
import Axios from 'axios';

export type CreateGroupResponse = Group;

export type CreateGroupRequest = Request<CreateGroupResponse>;

export type CreateGroup = (
  name: string,
  description?: string,
) => CreateGroupRequest;

/**
 * Sends the request to create a new group with the specified
 * name and the optional description.
 * @param name        - The name of the group.
 * @param description - The description of the group (optional)
 * @param axios       - If provided the method will use this instance of axios
 *    instead of the default one.
 */
export const createGroup: CreateGroup = (
    name,
    description,
    axios: AxiosType = Axios,
) => {
  if (typeof name !== 'string' &&
  (typeof description === 'undefined' || typeof description === 'string')) {
    return Promise.reject(new TypeError('Parameter invalid'));
  }

  return axios.post('/api/group', {name, description});
};
