import {Request, GroupWithOwnerAndMembers} from 'lib';
import {AxiosType} from '../request';
import Axios from 'axios';

export type GetGroupResponse = GroupWithOwnerAndMembers;
export type GetGroupRequest = Request<GetGroupResponse>;
export type GetGroup = (id: number) => GetGroupRequest;

/**
 * Gets the group with the specified id from the backend.
 * @param id    - The id of the group
 * @param axios - The axios instance to use, if not provided
 *                the method will use the static axios object.
 */
export const getGroup: GetGroup = (
    id,
    axios: AxiosType = Axios,
) => {
  // Check parameters
  if (typeof id !== 'number') {
    return Promise.reject(new TypeError('id has to be a number'));
  }

  return axios.get<GetGroupResponse>(
      `/api/group/${id}`,
  );
};
