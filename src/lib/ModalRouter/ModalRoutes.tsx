import React from 'react';
import {Route, Switch} from 'react-router-dom';
import ImprintDialog from 'modals/legal/imprint/ImprintDialog';
import PrivacyPolicyDialog from
  'modals/legal/privacyPolicy/PrivacyPolicyDialog';
import AuthenticationDialog from 'modals/auth/AuthenticationDialog';

interface ModalRoutesProps {
  nestedLocation: {
    pathname: string;
  };
  close(): void;
}

export const ModalRoutes: React.FC<ModalRoutesProps> = (props) => {
  const {nestedLocation, close} = props;

  /* eslint-disable @typescript-eslint/no-explicit-any */
  return (
    <Switch location={nestedLocation as any}>
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
