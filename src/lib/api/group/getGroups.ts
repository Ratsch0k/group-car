import axiosInstance from 'axios';
import {Request, GroupWithOwner} from 'lib';
import {AxiosType} from '../request';

/**
 * Response data for the get groups request.
 *
 * Consists of an object with one field which is an array
 * of all groups the currently logged in user is a member of.
 */
export interface GetGroupsResponse {
  /**
   * Array of all groups the currently logged in user is a member of.
   */
  groups: GroupWithOwner[];
}

/**
 * Request of the getGroups request.
 */
export type GetGroupsRequest = Request<GetGroupsResponse>;


/**
 * Get all groups of which the currently logged in user is a member.
 */
export const getGroups = (
    axios: AxiosType = axiosInstance,
): GetGroupsRequest => {
  return axios.get<GetGroupsResponse>(
      '/api/group',
  );
};
