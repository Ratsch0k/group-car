import {Request} from 'lib';
import axios from 'lib/client';

export type DeleteGroupRequest = Request<void>;

export type DeleteGroup = (
  id: number,
) => DeleteGroupRequest;

/**
 * Sends the request to delete the group with the specified id.
 * This only works if the logged in user is the owner of the group.
 * @param id    Id of the group to delete
 */
export const deleteGroup: DeleteGroup = (
  id,
) => {
  if (typeof id !== 'number') {
    return Promise.reject(new TypeError('id has to be a number'));
  }

  return axios.delete(`/api/group/${id}`);
};
