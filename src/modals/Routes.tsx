import React from 'react';
import {Route, Switch} from 'react-router-dom';
import ImprintDialog from 'modals/legal/ImprintDialog';
import PrivacyPolicyDialog from
  'modals/legal/PrivacyPolicyDialog';
import AuthenticationDialog from 'modals/auth/AuthenticationDialog';
import Group from 'modals/group/Group';
import {Invites} from './invites';
import {useAppDispatch, useShallowAppSelector} from 'lib/redux/hooks';
import {
  closeModal,
  getModalLocation,
} from 'lib/redux/slices/modalRouter/modalRouterSlice';
import Versions from './versions';
import Settings from './settings';

export const Routes: React.FC = () => {
  const modalLocation = useShallowAppSelector(getModalLocation);
  const dispatch = useAppDispatch();

  return (
    <Switch location={modalLocation}>
      <Route path='/imprint'>
        <ImprintDialog />
      </Route>
      <Route path='/privacy-policy'>
        <PrivacyPolicyDialog />
      </Route>
      <Route path='/auth'>
        <AuthenticationDialog
          open={true}
          close={() => dispatch(closeModal())}
        />
      </Route>
      <Route path='/group'>
        <Group />
      </Route>
      <Route path='/invites'>
        <Invites />
      </Route>
      <Route path='/versions'>
        <Versions />
      </Route>
      <Route path='/settings'>
        <Settings />
      </Route>
    </Switch>
  );
};

export default Routes;
