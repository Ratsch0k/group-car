import Axios from 'axios';
import {GroupCars} from 'lib';
import {AxiosType, Request} from '../request';

export type GetCarsResponse = GroupCars;
export type GetCarsRequest = Request<GetCarsResponse>;

export type GetCars = (
  groupId: number,
) => GetCarsRequest;

/**
 * Sends request to get a list of all cars of the specified group.
 * @param groupId Id of the group
 * @param axios   Optional axios instance
 */
export const getCars: GetCars = (
    groupId,
    axios: AxiosType = Axios,
) => {
  return axios.get(`/api/group/${groupId}/car`);
};
