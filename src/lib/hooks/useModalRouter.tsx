import {useContext} from 'react';
import {IModalContext, ModalContext} from 'lib';

/**
 * Hook for using the `ModalContext`
 */
const useModalRouter = (): IModalContext => {
  return useContext(ModalContext);
};

export default useModalRouter;
