import React, {useEffect} from 'react';
import {useLocation, useHistory} from 'react-router-dom';
import queryString from 'query-string';

const AuthRedirect: React.FC = (props) => {
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    // Get state if exists
    const state: any = location.state || {};

    // Get the query
    const params = queryString.parse(location.search);

    // Check auth in query and get value
    const onAuthRoute = params.auth && (
      params.auth === '/' ||
      params.auth === '/login' ||
      params.auth === '/sign-up'
    );

    // Get the type of authentication
    const authType = params.auth;

    // Check if the state needs to be changed
    const needsStateChange = onAuthRoute && !state.auth;

    if (needsStateChange) {
      // Remove the query from the path and set the correct state
      history.replace(location as any, {...location.state, auth: authType});
    }
  }, [location, history]);

  return (
    <>
      {props.children}
    </>
  );
};

export default AuthRedirect;
