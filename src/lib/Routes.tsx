import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Map from '../pages/Map';

export const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path='/'>
        <Map />
      </Route>
    </Switch>
  );
};

export default Routes;
