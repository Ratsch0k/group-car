import {CarColor, CarWithDriver, AxiosType, Request} from 'lib';
import Axios from 'axios';

export type CreateCarResponse = CarWithDriver;
export type CreateCarRequest = Request<CreateCarResponse>;
export type CreateCar = (
  groupId: number,
  name: string,
  color: CarColor,
) => CreateCarRequest;

/**
 * Sends request to create a car.
 *
 * User has to be an admin of the group, no other car of that group
 * is should have the name and the color.
 * @param groupId Id of the group for which the car should be created
 * @param name    Name for the car
 * @param color   Color of the car
 * @param axios   Optional instance.
 */
export const createCar: CreateCar = (
  groupId,
  name,
  color,
  axios: AxiosType = Axios,
) => {
  return axios.post(`/api/group/${groupId}/car`, {
    name,
    color,
  });
};
