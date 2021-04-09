import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Map from './Map';
import Redux from './Redux';

export const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path='/redux'>
        <Redux />
      </Route>
      <Route path='/'>
        <Map />
      </Route>
    </Switch>
  );
};

export default Routes;
