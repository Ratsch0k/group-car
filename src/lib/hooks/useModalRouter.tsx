import {useContext} from 'react';
import ModalContext from 'lib/ModalRouter/ModalRouteContext';

/**
 * Hook for using the `ModalContext`
 */
const useModalRouter = () => {
  return useContext(ModalContext);
};

export default useModalRouter;
