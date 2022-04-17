import React from 'react';
import {Route, Switch} from 'react-router-dom';
import ImprintDialog from 'modals/legal/ImprintDialog';
import PrivacyPolicyDialog from
  'modals/legal/PrivacyPolicyDialog';
import {useShallowAppSelector} from 'lib/redux/hooks';
import {
  getModalLocation,
} from 'lib/redux/slices/modalRouter/modalRouterSlice';
import Versions from './versions';

export const Routes: React.FC = () => {
  const modalLocation = useShallowAppSelector(getModalLocation);

  return (
    <Switch location={modalLocation}>
      <Route path='/imprint'>
        <ImprintDialog />
      </Route>
      <Route path='/privacy-policy'>
        <PrivacyPolicyDialog />
      </Route>
      <Route path='/versions'>
        <Versions />
      </Route>
    </Switch>
  );
};

export default Routes;
