import axios from 'lib/client';
import {Request} from '../request';

export type DriveCarRequest = Request<void>;
export type DriveCar = (
  groupId: number,
  carId: number,
) => DriveCarRequest;

export const driveCar: DriveCar = (
  groupId,
  carId,
) => {
  return axios.put(`/api/group/${groupId}/car/${carId}/drive`);
};
