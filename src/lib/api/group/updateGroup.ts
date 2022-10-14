import axios from 'axios';
import {Group, Request} from 'lib';

export type UpdateGroupResponse = Group;

export type UpdateGroupRequest = Request<UpdateGroupResponse>;

export type UpdateGroup = (
  id: number,
  name: string,
  description?: string,
) => UpdateGroupRequest;

export const updateGroup: UpdateGroup = (
  id,
  name,
  description,
) => {
  if (typeof id !== 'number' ||
        typeof name !== 'string' ||
        (description != undefined && typeof description !== 'string')) {
    return Promise.reject(new TypeError('Parameter invalid'));
  }

  return axios.put(`/api/group/${id}`, {name, description});
};
