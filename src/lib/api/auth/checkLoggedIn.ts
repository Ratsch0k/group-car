import {Request, AxiosType} from '../request';
import axiosStatic from 'axios';

export interface CheckLoggedInResponse {
  id: number;
  username: string;
  email: string;
  isBetaUser: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CheckLoggedInRequest = Request<CheckLoggedInResponse>;

export type CheckLoggedIn = () => CheckLoggedInRequest;

export const checkLoggedIn: CheckLoggedIn = (
    axios: AxiosType = axiosStatic,
): CheckLoggedInRequest => {
  return axios.put('/auth/token');
};
