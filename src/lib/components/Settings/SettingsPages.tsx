import {Switch} from 'react-router-dom';
import React from 'react';

export const SettingsPages: React.FC = (props) => {
  return (
    <Switch>
      {props.children}
    </Switch>
  );
};

export default SettingsPages;
