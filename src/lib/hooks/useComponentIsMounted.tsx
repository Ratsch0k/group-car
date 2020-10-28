import {useRef, useEffect, MutableRefObject} from 'react';

/**
 * Hook for checking if the current component is currently mounted.
 */
export const useComponentIsMounted = (): MutableRefObject<boolean> => {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  return isMounted;
};
