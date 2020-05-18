import React from 'react';
import {useLocation, useHistory, Switch, Route} from 'react-router-dom';
import AuthenticationDialog from
  '../../modals/legal/auth/AuthenticationDialog';
import queryString from 'query-string';
import Imprint from 'modals/legal/imprint/Imprint';
import {ModalProvider} from './ModalRouteContext';
import PrivacyPolicy from 'modals/legal/privacyPolicy/PrivacyPolicy';

const ModalCheck: React.FC = (props) => {
  const location = useLocation();
  const history = useHistory();


  const state: any = location.state || {};

  const routeKey = state.routeKey;
  const routeValue = state[routeKey];

  const close = () => {
    const search = queryString.parse(location.search);

    // Delete route from search
    if (search[routeKey] !== undefined) {
      delete search[routeKey];
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

  const goTo = (
      value: string | undefined | null,
      replace: boolean = false,
  ) => {
    /*
     * In the case that the value if undefined but the current route
     * is the only one on the history, instead of going back replace
     * with the value null
     */
    if (value === undefined && history.length === 1) {
      value = null;
      replace = true;
    }

    const query = queryString.stringify(
        {
          ...queryString.parse(location.search),
          [routeKey]: value,
        },
        {
          encode: false,
        },
    );

    // If the new value is undefined go back, if handle location change
    if (value === undefined) {
      history.goBack();
    } else {
      // Modify location and push to history

      // Set new search
      location.search = query;

      // Set route value in location state to avoid redirect
      location.state = {
        ...location.state,
        [routeKey]: value,
      };

      // Push modified location to history
      if (replace) {
        history.replace(location);
      } else {
        history.push(location);
      }
    }
  };

  const nestedLocation: any = {
    pathname: routeValue,
    state,
  };

  return (
    <>
      <ModalProvider
        close={close}
        route={routeValue}
        goTo={goTo}
      >
        <Switch location={nestedLocation}>
          <Route path='/imprint'>
            <Imprint />
          </Route>
          <Route path='/policy'>
            <PrivacyPolicy />
          </Route>
          <Route path='/auth'>
            <AuthenticationDialog
              open={true}
              close={close}
            />
          </Route>
        </Switch>
      </ModalProvider>
      {props.children}
    </>
  );
};

export default ModalCheck;
