import {Request, AxiosType} from '../request';
import axiosStatic from 'axios';
import {User} from '../user';

export type CheckLoggedInRequest = Request<User>;
export type CheckLoggedIn = () => CheckLoggedInRequest;

export const checkLoggedIn: CheckLoggedIn = (
    axios: AxiosType = axiosStatic,
): CheckLoggedInRequest => {
  return axios.put('/auth/token');
};
