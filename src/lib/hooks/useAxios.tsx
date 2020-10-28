import {AxiosContext} from 'lib';
import {useContext} from 'react';

/**
 * Hooks for using the `AxiosContext`
 */
export const useAxios = (): AxiosContext => {
  return useContext(AxiosContext);
};

export default useAxios;
