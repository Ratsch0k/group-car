import Axios, {AxiosInstance} from 'axios';
import {Request} from 'lib';

export type DeleteGroupRequest = Request<void>;

export type DeleteGroup = (
  id: number,
) => DeleteGroupRequest;

/**
 * Sends the request to delete the group with the specified id.
 * This only works if the logged in user is the owner of the group.
 * @param id    Id of the group to delete
 * @param axios Optional axios instance
 */
export const deleteGroup: DeleteGroup = (
  id,
  axios: AxiosInstance = Axios,
) => {
  if (typeof id !== 'number') {
    return Promise.reject(new TypeError('id has to be a number'));
  }

  return axios.delete(`/api/group/${id}`);
};
