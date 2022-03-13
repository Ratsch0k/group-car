import {Request, InviteWithGroupAndInviteSender} from '..';
import axios from 'axios';

/**
 * Response of get invites of users request.
 */
export interface GetInvitesOfUserResponse {
  invites: (InviteWithGroupAndInviteSender)[];
}

/**
 * Get invites of user request.
 */
export type GetInvitesOfUserRequest = Request<GetInvitesOfUserResponse>;
export type GetInvitesOfUser = () => GetInvitesOfUserRequest;

/**
 * Gets all invites of the currently logged in user.
 */
export const getInvitesOfUser: GetInvitesOfUser = () => {
  return axios.get<GetInvitesOfUserResponse>('/api/user/invite');
};
