import {useComponentIsMounted} from 'lib';
import {useState} from 'react';

export type useStateIfMounted<T> = [T, React.Dispatch<React.SetStateAction<T>>];

/**
 * Wrapper for the `useState` hook which will only set
 * the state if the component is mounted.
 * @param initValue The initial value of the state
 */
export function useStateIfMounted<T>(initValue: T): useStateIfMounted<T> {
  const isMounted = useComponentIsMounted();
  const [state, setState] = useState<T>(initValue);
  const overriddenSetState = (value: React.SetStateAction<T>) => {
    if (isMounted.current) {
      setState(value);
    }
  };

  return [state, overriddenSetState];
}
