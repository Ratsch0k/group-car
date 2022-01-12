import React, {FC} from 'react';

export interface SettingsProps {
  children: React.ReactElement[];
  value: number;
}

export const Settings: FC<SettingsProps> = (
  props: SettingsProps,
) => {
  const {children, value} = props;

  if (value === null) {
    return children[0];
  } else {
    return children[value + 1];
  }
};

export default Settings;
