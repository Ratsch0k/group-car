import Axios from 'axios';
import {AxiosType, InviteWithUserAndInviteSender, Request} from 'lib';

/**
 * Response of the get invites request.
 */
export interface GetInvitesOfGroupResponse {
  invites: InviteWithUserAndInviteSender[];
}
export type GetInvitesOfGroupRequest = Request<GetInvitesOfGroupResponse>;
export type GetInvitesOfGroup = (id: number) => GetInvitesOfGroupRequest;

/**
 * Gets the list of invites for the specified group.
 * @param id    The id of the group
 * @param axios Optional axios instance which will be used if provided
 */
export const getInvitesOfGroup: GetInvitesOfGroup = (
    id: number,
    axios: AxiosType = Axios,
) => {
  if (typeof id !== 'number') {
    return Promise.reject(new TypeError('id has to be a number'));
  }

  return axios.get<GetInvitesOfGroupResponse>(
      `/api/group/${id}/invites`,
  );
};
