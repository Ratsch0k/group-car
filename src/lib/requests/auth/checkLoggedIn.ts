import axios from 'axios';
import {Request} from '../request';

export interface CheckLoggedInResponse {
  id: number;
  username: string;
  email: string;
  isBetaUser: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CheckLoggedInRequest = Request<CheckLoggedInResponse>;

export const checkLoggedIn = (): CheckLoggedInRequest => {
  const source = axios.CancelToken.source();

  const request = axios.put('/auth/token', undefined, {
    cancelToken: source.token,
  });

  return {
    request,
    cancel: source.cancel,
  };
};
