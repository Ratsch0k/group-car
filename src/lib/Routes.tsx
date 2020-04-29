import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Authentication from '../pages/auth';

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path={['/auth']}>
        <Authentication />
      </Route>
    </Switch>
  );
};

export default Routes;
