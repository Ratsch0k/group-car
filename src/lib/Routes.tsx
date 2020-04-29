import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Authentication from '../pages/auth';
import PrivacyPolicy from 'pages/legal/privacyPolicy/PrivacyPolicy';
import Imprint from 'pages/legal/imprint/Imprint';

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path='/auth'>
        <Authentication />
      </Route>
      <Route path='/legal/policy'>
        <PrivacyPolicy />
      </Route>
      <Route path='/legal/imprint'>
        <Imprint />
      </Route>
    </Switch>
  );
};

export default Routes;
