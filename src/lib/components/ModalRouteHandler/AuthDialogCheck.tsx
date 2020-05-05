import React from 'react';
import {useLocation, useHistory} from 'react-router-dom';
import AuthenticationDialog from '../Authentication/AuthenticationDialog';
import queryString from 'query-string';

type AuthType = import('../Authentication/AuthenticationDialog').AuthType;

const AuthDialogCheck: React.FC = (props) => {
  const location = useLocation();
  const history = useHistory();


  const state: any = location.state || {};

  const auth = state.auth;

  let authType;
  if (auth) {
    authType = auth.length > 1 ? auth.replace('/', '') : undefined;
  }

  const close = () => {
    const search = queryString.parse(location.search);
    if (search.auth) {
      search.auth = undefined;
    }

    const query = queryString.stringify(
        {
          ...search,
        },
        {
          encode: false,
        },
    );

    history.push(location.pathname + '?' + query);
  };


  const onAuthTypeChange = (type: AuthType) => {
    const auth = '/' + (type || '');

    const query = queryString.stringify(
        {
          ...queryString.parse(location.search),
          auth,
        },
        {
          encode: false,
        },
    );

    if (!type) {
      history.goBack();
    } else {
      history.push(location.pathname + '?' + query, {auth});
    }
  };

  return (
    <>
      {
        auth &&
        <AuthenticationDialog
          open={true}
          close={close}
          initialAuthType={authType}
          onAuthTypeChange={onAuthTypeChange}
          authType={authType}
        />
      }
      {props.children}
    </>
  );
};

export default AuthDialogCheck;
