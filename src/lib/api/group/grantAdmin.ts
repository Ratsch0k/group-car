import {Request} from 'lib';
import axios from 'lib/client';

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
) => {
  return axios.put(`/api/group/${groupId}/member/${userId}/admin/grant`);
};
