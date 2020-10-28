import {useContext} from 'react';
import {ModalContext} from 'lib';

/**
 * Hook for using the `ModalContext`
 */
const useModalRouter = (): ModalContext => {
  return useContext(ModalContext);
};

export default useModalRouter;
