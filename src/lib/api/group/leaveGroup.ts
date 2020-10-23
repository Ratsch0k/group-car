import Axios, {AxiosInstance} from 'axios';
import {Request} from 'lib';

export type LeaveGroupRequest = Request<void>;
export type LeaveGroup = (id: number) => LeaveGroupRequest;

/**
 * Sends request to leave the specified group.
 * @param id    Id of the group
 * @param axios Optional axios instance
 */
export const leaveGroup: LeaveGroup = (
    id,
    axios: AxiosInstance = Axios,
) => {
  if (typeof id !== 'number') {
    return Promise.reject(new TypeError('id has to be a number'));
  }

  return axios.post(`/api/group/${id}/leave`);
};
