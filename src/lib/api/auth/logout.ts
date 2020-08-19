import axiosStatic from 'axios';
import {Request} from 'lib';
import {AxiosType} from '../request';

export type LogOutRequest = Request<void>;
export type LogOut = () => LogOutRequest;

/**
 * Sends a logout request to the backend.
 * @return the request and a method to cancel it
 */
export const logout: LogOut = (axios: AxiosType = axiosStatic) => {
  return axios.put('/auth/logout');
};
