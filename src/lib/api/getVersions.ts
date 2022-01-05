import axios from 'axios';
import {BackendVersions} from 'lib';
import {Request} from './request';

export type GetVersionsRequest = Request<BackendVersions>
export type GetVersions = () => GetVersionsRequest;

/**
 * Get versions of front- and backend.
 */
export const getVersions: GetVersions = () => {
  return axios.get<BackendVersions>(
    '/versions.json',
    {allowUnauthenticated: true},
  );
};
