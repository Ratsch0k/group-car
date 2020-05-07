type AxiosResponse = import('axios').AxiosResponse;
type Canceler = import('axios').Canceler;

/**
 * Interface for the return type of each request.\
 * The axios request itself will be returned with the attribute
 * `request`.\
 * The request can be canceled by calling the attribute `cancel`.
 */
export interface Request {
  request: Promise<AxiosResponse<any>>;
  cancel: Canceler;
};
