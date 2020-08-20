import {useContext} from 'react';
import {ApiContext, Api} from 'lib';

/**
 * Shortcut hook for using the `ApiContext`.
 */
export const useApi = (): Api => {
  return useContext(ApiContext);
};
