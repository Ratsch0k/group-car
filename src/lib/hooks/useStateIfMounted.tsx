import {useComponentIsMounted} from 'lib';
import {useState, useCallback} from 'react';

export type useStateIfMounted<T> = [T, React.Dispatch<React.SetStateAction<T>>];

/**
 * Wrapper for the `useState` hook which will only set
 * the state if the component is mounted.
 * @param initValue The initial value of the state
 */
export const useStateIfMounted =
<T extends unknown>(initValue: T): useStateIfMounted<T> => {
  const isMounted = useComponentIsMounted();
  const [state, setState] = useState<T>(initValue);
  const overriddenSetState = useCallback((value: React.SetStateAction<T>) => {
    if (isMounted.current) {
      setState(value);
    }
  }, [isMounted]);

  return [state, overriddenSetState];
};
