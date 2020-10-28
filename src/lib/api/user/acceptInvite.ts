import Axios, {AxiosInstance} from 'axios';
import {Request} from '../request';

export type AcceptInviteRequest = Request<void>;
export type AcceptInvite = (groupId: number) => AcceptInviteRequest;

/**
 * Accepts the invite to the specified group.
 * @param groupId The id of the group
 * @param axios   Optional axios instance
 */
export const acceptInvite: AcceptInvite = (
    groupId,
    axios: AxiosInstance = Axios,
) => {
  return axios.post(`/api/user/invite/${groupId}/join`);
};
