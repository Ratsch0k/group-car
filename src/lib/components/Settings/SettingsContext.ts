import {createContext} from 'react';

export interface SettingsContext<D> {
  value: D | null;
  open: (index: D) => void;
  back: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SettingsContext = createContext<SettingsContext<any>>({
  value: null,
  open: () => undefined,
  back: () => undefined,
});

export default SettingsContext;
