import axios from 'lib/client';
import {Request} from '../request';

export type AcceptInviteRequest = Request<void>;
export type AcceptInvite = (groupId: number) => AcceptInviteRequest;

/**
 * Accepts the invite to the specified group.
 * @param groupId The id of the group
 */
export const acceptInvite: AcceptInvite = (
  groupId,
) => {
  return axios.post(`/api/user/invite/${groupId}/join`);
};
