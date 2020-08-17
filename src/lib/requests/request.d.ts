import {AxiosResponse} from 'axios';

export interface RestError {
  status: string;
  statusCode: number;
  timestamp: Date;
  message: string;
  detail?: Record;
}

/**
 * Interface for the return type of each request.\
 * The axios request itself will be returned with the attribute
 * `request`.\
 * The request can be canceled by calling the attribute `cancel`.
 */
export interface Request<T> {
  request: Promise<AxiosResponse<T>>;
  cancel: Canceler;
}
