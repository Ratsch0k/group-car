import React, {FC, useState} from 'react';
import SettingsContext from './SettingsContext';

export const SettingsContextProvider: FC = (props) => {
  const {children} = props;
  const [value, setValue] = useState<number | null>(null);

  return (
    <SettingsContext.Provider value={{
      value,
      open: (index) => setValue(index),
      back: () => setValue(null),
    }}>
      {children}
    </SettingsContext.Provider>
  );
};
