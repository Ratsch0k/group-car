import {Request, GroupWithOwner} from 'lib';
import axios from 'lib/client';

export type GetGroupResponse = GroupWithOwner;
export type GetGroupRequest = Request<GetGroupResponse>;
export type GetGroup = (id: number) => GetGroupRequest;

/**
 * Gets the group with the specified id from the backend.
 * @param id    - The id of the group
 */
export const getGroup: GetGroup = (
  id,
) => {
  // Check parameters
  if (typeof id !== 'number') {
    return Promise.reject(new TypeError('id has to be a number'));
  }

  return axios.get<GetGroupResponse>(
    `/api/group/${id}`,
  );
};
