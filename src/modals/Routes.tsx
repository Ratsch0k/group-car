import React from 'react';
import {Route, Switch} from 'react-router-dom';
import ImprintDialog from 'modals/legal/ImprintDialog';
import PrivacyPolicyDialog from
  'modals/legal/PrivacyPolicyDialog';
import AuthenticationDialog from 'modals/auth/AuthenticationDialog';
import {useModalRouter} from 'lib/hooks';
import Group from 'modals/group/Group';

export const Routes: React.FC = () => {
  const {modalLocation, close} = useModalRouter();

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
          close={close}
        />
      </Route>
      <Route path='/group'>
        <Group />
      </Route>
    </Switch>
  );
};

export default Routes;
