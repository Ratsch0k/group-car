import Axios from 'axios';
import {Request, AxiosType,
} from 'lib';

export type ParkCarRequest = Request<void>;
export type ParkCar = (
  groupId: number,
  carId: number,
  latitude: number,
  longitude: number,
) => ParkCarRequest;

/**
 * Sends a request to park the specified car of the specified group
 * at the specified location. The location is represented with latitude
 * and longitude.
 * @param groupId   Id of the group
 * @param carId     Id of the car
 * @param latitude  Latitude of the location
 * @param longitude Longitude of the location
 * @param axios     Optional axios instance
 */
export const parkCar: ParkCar = (
  groupId,
  carId,
  latitude,
  longitude,
  axios: AxiosType = Axios,
) => {
  return axios.put(
    `/api/group/${groupId}/car/${carId}/park`,
    {
      latitude,
      longitude,
    },
  );
};
