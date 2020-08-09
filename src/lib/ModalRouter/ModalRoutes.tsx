import React from 'react';
import {Route, Switch} from 'react-router-dom';
import ImprintDialog from 'modals/legal/imprint/ImprintDialog';
import PrivacyPolicyDialog from
  'modals/legal/privacyPolicy/PrivacyPolicyDialog';
import AuthenticationDialog from 'modals/auth/AuthenticationDialog';

interface ModalRoutesProps {
  nestedLocation: any;
  close(): void;
}

const ModalRoutes: React.FC<ModalRoutesProps> = (props) => {
  const {nestedLocation, close} = props;

  return (
    <Switch location={nestedLocation}>
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
