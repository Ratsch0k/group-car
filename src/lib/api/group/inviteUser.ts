import Axios from 'axios';
import {AxiosType, Request} from 'lib';

/**
 * Request for the `inviteUser` request.
 */
export type InviteUserRequest = Request<void>

/**
 * Type of the `inviteUser` method.
 */
export type InviteUser = (
  groupId: number,
  userId: number,
) => InviteUserRequest;

/**
 * Invites the specified user to the specified group.
 *
 * This only works if the client is loggedin in and is the admin of the group.
 * @param groupId   The id of the group to which the user should be invited
 * @param userId    The id of the user who should be invited
 * @param axios     Optional axios instance,
 *                  if not provided the AxiosStatic will be used.
 */
export const inviteUser: InviteUser = (
    groupId,
    userId,
    axios: AxiosType = Axios,
) => {
  if (typeof groupId === 'number' && typeof userId === 'number') {
    return axios.post(`/api/group/${groupId}/invite`, {userId});
  } else {
    return Promise.reject(new TypeError('Parameter invalid'));
  }
};
