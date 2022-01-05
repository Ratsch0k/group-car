import axios from 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig<D> extends axios.AxiosRequestConfig<D> {
    allowUnauthenticated?: boolean;
  }
}
