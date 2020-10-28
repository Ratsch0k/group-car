import {SnackbarContext} from 'lib';
import {useContext} from 'react';

/**
 * Shortcut hook for using SnackbarContext.
 */
export const useSnackBar = (): SnackbarContext => {
  return useContext(SnackbarContext);
};

export default useSnackBar;
