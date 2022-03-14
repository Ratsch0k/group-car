import {Request} from '../index';
import axios from 'axios';

export type ChangePassword = (
  oldPassword: string,
  newPassword: string,
) => Request<void>;

/**
 * Sends request to change the user's password
 * @param oldPassword The old/current password
 * @param newPassword The new password
 */
export const changePassword: ChangePassword = (
  oldPassword,
  newPassword,
) => {
  return axios.post(
    '/api/user/settings/change-password',
    {oldPassword, newPassword},
  );
};
