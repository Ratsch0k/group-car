import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Authentication from './Auth';
import {lazyWithPreload} from '../lib/util/lazyWithPreload';

const GroupCar = lazyWithPreload(() => import('./GroupCar'));

export const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path='/auth'>
        <Authentication preloadMain={GroupCar.preload} />
      </Route>
      <Route path='/'>
        <GroupCar/>
      </Route>
    </Switch>
  );
};

export default Routes;
