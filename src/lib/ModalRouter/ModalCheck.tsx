import React from 'react';
import {useLocation, useHistory} from 'react-router-dom';
import queryString from 'query-string';
import {ModalProvider} from './ModalRouteContext';

export const ModalCheck: React.FC = (props) => {
  const location = useLocation();
  const history = useHistory();

  // Get path from query
  let routeValue = queryString.parse(location.search).modal || '/';
  if (Array.isArray(routeValue) && routeValue.length > 0) {
    routeValue = routeValue[0];
  } else if (Array.isArray(routeValue)) {
    routeValue = '/';
  }

  const close = () => {
    const search = queryString.parse(location.search);

    // Delete route from search
    if (search.modal !== undefined) {
      delete search.modal;
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
      replace = false,
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
          modal: value,
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
        modal: value,
      };

      // Push modified location to history
      if (replace) {
        history.replace(location);
      } else {
        history.push(location);
      }
    }
  };

  const nestedLocation = {
    pathname: routeValue,
    search: '',
    state: undefined,
    hash: '',
  };

  return (
    <>
      <ModalProvider
        close={close}
        route={routeValue}
        goTo={goTo}
        modalLocation={nestedLocation}
      >
        {props.children}
      </ModalProvider>
    </>
  );
};

export default ModalCheck;
