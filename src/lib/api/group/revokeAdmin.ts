import Axios, {AxiosInstance} from 'axios';
import {Request} from 'lib';

export type RevokeAdminRequest = Request<void>;
export type RevokeAdmin = (
  groupId: number,
  userId: number,
) => RevokeAdminRequest;

/**
 * Sends request to revoke admin permission of the specified
 * user for the specified group.
 * @param groupId   Id of the group
 * @param userId    If of the user
 * @param axios     Optional axios instance
 */
export const revokeAdmin: RevokeAdmin = (
  groupId,
  userId,
  axios: AxiosInstance = Axios,
) => {
  return axios.put(`/api/group/${groupId}/member/${userId}/admin/revoke`);
};
