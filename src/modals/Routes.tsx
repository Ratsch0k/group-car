import React from 'react';
import {Route, Switch} from 'react-router-dom';
import ImprintDialog from 'modals/legal/ImprintDialog';
import PrivacyPolicyDialog from
  'modals/legal/PrivacyPolicyDialog';
import AuthenticationDialog from 'modals/auth/AuthenticationDialog';
import Group from 'modals/group/Group';
import {Invites} from './invites';
import {useAppDispatch, useAppSelector} from 'lib/redux/hooks';
import {
  closeModal,
  getModalLocation,
} from 'lib/redux/slices/modalRouter/modalRouterSlice';

export const Routes: React.FC = () => {
  const modalLocation = useAppSelector(getModalLocation);
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
    </Switch>
  );
};

export default Routes;
