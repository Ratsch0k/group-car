import React, {FC} from 'react';
import {List} from '@material-ui/core';

export const SettingsTabs: FC = (props) => {
  return (
    <List>
      {props.children}
    </List>
  );
};

export default SettingsTabs;
