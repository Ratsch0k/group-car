import Axios from 'axios';
import {AxiosType, InviteWithUserAndInviteSender, Request} from 'lib';

/**
 * Response of the get invites request.
 */
export interface GetInvitesResponse {
  invites: InviteWithUserAndInviteSender[];
}
export type GetInvitesRequest = Request<GetInvitesResponse>;
export type GetInvites = (id: number) => GetInvitesRequest;

/**
 * Gets the list of invites for the specified group.
 * @param id    The id of the group
 * @param axios Optional axios instance which will be used if provided
 */
export const getInvites: GetInvites = (
    id: number,
    axios: AxiosType = Axios,
) => {
  if (typeof id !== 'number') {
    return Promise.reject(new TypeError('id has to be a number'));
  }

  return axios.get<GetInvitesResponse>(
      `/api/group/${id}/invites`,
  );
};
