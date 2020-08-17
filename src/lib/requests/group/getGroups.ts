import axios from 'axios';
import {Request, GroupWithOwner} from 'lib';

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
export const getGroups = (): GetGroupsRequest => {
  const source = axios.CancelToken.source();

  const request = axios.get<GetGroupsResponse>(
      '/api/group',
      {
        cancelToken: source.token,
      },
  );

  return {
    request,
    cancel: source.cancel,
  };
};
