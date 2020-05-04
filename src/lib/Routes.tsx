import React from 'react';
import {Route, Switch} from 'react-router-dom';
import PrivacyPolicy from 'pages/legal/privacyPolicy/PrivacyPolicy';
import Imprint from 'pages/legal/imprint/Imprint';
import Auth from 'pages/auth/Auth';

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path='/auth'>
        <Auth />
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
