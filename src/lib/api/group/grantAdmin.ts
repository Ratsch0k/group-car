import Axios, {AxiosInstance} from 'axios';
import {Request} from 'lib';

export type GrantAdminRequest = Request<void>;
export type GrantAdmin = (groupId: number, userId: number) => GrantAdminRequest;

/**
 * Sends request to grant the specified user admin
 * rights for the specified group.
 * @param groupId Id of the group
 * @param userId  Id of the user
 * @param axios   Optional axios instance
 */
export const grantAdmin: GrantAdmin = (
    groupId,
    userId,
    axios: AxiosInstance = Axios,
) => {
  return axios.put(`/api/group/${groupId}/${userId}/admin/grant`);
};
