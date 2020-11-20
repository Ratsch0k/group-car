import Axios from 'axios';
import {Request, AxiosType} from '../request';

export type DriveCarRequest = Request<void>;
export type DriveCar = (
  groupId: number,
  carId: number,
) => DriveCarRequest;

export const driveCar: DriveCar = (
    groupId,
    carId,
    axios: AxiosType = Axios,
) => {
  return axios.put(`/api/group/${groupId}/car/${carId}/drive`);
};
