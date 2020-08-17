import React from 'react';
import {Route, Switch} from 'react-router-dom';
import ImprintDialog from 'modals/legal/imprint/ImprintDialog';
import PrivacyPolicyDialog from
  'modals/legal/privacyPolicy/PrivacyPolicyDialog';
import AuthenticationDialog from 'modals/auth/AuthenticationDialog';
import {useModalRouter} from 'lib/hooks';

export const ModalRoutes: React.FC = () => {
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
    </Switch>
  );
};

export default ModalRoutes;
