import React, {useEffect} from 'react';
import {useLocation, useHistory} from 'react-router-dom';
import queryString from 'query-string';

/**
 * Names of parameters in url which will
 * redirect to a modal.
 * First name which matches will be written
 * to state (only one modal should be displayed at any given time)
 */
const modalRoutes = [
  'auth',
  'imprint',
  'modal',
];

const ModalRedirect: React.FC = (props) => {
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    // Get state if exists
    const state: any = location.state || {};

    // Get the query
    const params = queryString.parse(location.search);

    // Check if any of the params is a defined modal route
    const paramsKeys = Object.keys(params);
    let route: string | undefined = undefined;
    /*
     * Iterate through modal routes and check for each
     * if the string for the route is contained in the
     * params
     */
    for (let i = 0; i < modalRoutes.length; i++) {
      if (paramsKeys.includes(modalRoutes[i])) {
        route = modalRoutes[i];
        break;
      }
    }

    if (route !== undefined) {
    // Get the type of authentication
      const routeValue = params[route];

      // Check if the state needs to be changed
      const needsStateChange = route &&
        (
          state[route] === undefined
        );

      if (needsStateChange) {
        /*
         * Remove the query from the path and set the correct state
         * The state consists of the state which already exists
         * and two new properties:
         *  - the string of the route which should be
         *      displayed and the value is the route value
         *  - routeKey: the string of the route to display
         *      (important so that the ModalCheck know which component to load)
         */
        // Change state of location
        location.state = {
          ...location.state,
          [route]: routeValue,
          routeKey: route,
        };

        // Replace location in history with modified state
        history.replace(location as any);
      }
    }
  }, [location, history]);

  return (
    <>
      {props.children}
    </>
  );
};

export default ModalRedirect;
