import React from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import AuthenticationDialog from 'lib/components/Authentication';
import {AuthType} from 'lib/components/Authentication/AuthenticationDialog';

type TAuthType = import('lib/components/Authentication/AuthenticationDialog')
  .AuthType;

const Auth: React.FC = () => {
  const history = useHistory();
  const location = useLocation();

  // Extract if user wants to sign-up or login
  const allPaths = location.pathname.split('/');
  let lastPath: string | undefined =
    allPaths[allPaths.length - 1].split('?')[0];

  if (!(AuthType.includes(lastPath))) {
    lastPath = undefined;
  }

  const onAuthTypeChange = (type: TAuthType) => {
    if (type) {
      history.push(`/auth/${type}`);
    } else {
      history.replace('/auth');
    }
  };

  return (
    <AuthenticationDialog
      open={true}
      close={() => history.push('/')}
      initialAuthType={lastPath as TAuthType}
      onAuthTypeChange={onAuthTypeChange}
    />
  );
};

export default Auth;
