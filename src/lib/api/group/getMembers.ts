import Axios from 'axios';
import {Member, Request, AxiosType} from 'lib';

/**
 * Response of the get members response.
 */
export interface GetMembersResponse {
  /**
   * The list of members.
   */
  members: Member[];
}
export type GetMembersRequest = Request<GetMembersResponse>;
export type GetMembers = (id: number) => GetMembersRequest;

/**
 * Get the list of members of the specified group-
 * @param id    The id of the group
 * @param axios Optional axios instance which will be used if provided
 */
export const getMembers: GetMembers = (
    id,
    axios: AxiosType = Axios,
) => {
  if (typeof id !== 'number') {
    return Promise.reject(new TypeError('id has to be a number'));
  }

  return axios.get<GetMembersResponse>(
      `/api/group/${id}/members`,
  );
};
