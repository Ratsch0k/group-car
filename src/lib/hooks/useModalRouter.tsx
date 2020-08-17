import {useContext} from 'react';
import ModalContext, {IModalContext} from 'lib/ModalRouter/ModalRouteContext';

/**
 * Hook for using the `ModalContext`
 */
const useModalRouter = (): IModalContext => {
  return useContext(ModalContext);
};

export default useModalRouter;
