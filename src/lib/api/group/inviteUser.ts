import Axios from 'axios';
import {AxiosType, Request} from 'lib';
import {Invite} from '..';

export type InviteUserResponse = Invite;
/**
 * Request for the `inviteUser` request.
 */
export type InviteUserRequest = Request<InviteUserResponse>

/**
 * Type of the `inviteUser` method.
 */
export type InviteUser = (
  groupId: number,
  usernameOrIdId: number | string,
) => InviteUserRequest;

/**
 * Invites the specified user to the specified group.
 *
 * This only works if the client is loggedin in and is the admin of the group.
 * @param groupId   The id of the group to which the user should be invited
 * @param usernameOrId Either the id of a user or the username
 * @param axios     Optional axios instance,
 *                  if not provided the AxiosStatic will be used.
 */
export const inviteUser: InviteUser = (
    groupId,
    usernameOrId,
    axios: AxiosType = Axios,
) => {
  if (typeof groupId === 'number' && (
    typeof usernameOrId === 'number' || typeof usernameOrId === 'string')
  ) {
    const body: Record<string, number | string> = {};
    if (typeof usernameOrId === 'number') {
      body.userId = usernameOrId;
    } else {
      body.username = usernameOrId;
    }

    return axios.post<InviteUserResponse>(`/api/group/${groupId}/invite`, body);
  } else {
    return Promise.reject(new TypeError('Parameter invalid'));
  }
};
