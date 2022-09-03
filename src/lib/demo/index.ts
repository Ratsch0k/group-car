/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * This file wraps every communication request to the server and
 * handles the request itself.
 * It has a default state and will modify it according to the send request.
 * This state is synchronized from session storage and loaded from it
 * on a page reload.
 *
 * This ensures that the website can be used without any request
 * reaching the server.
 *
 * This file must simply be imported for it to spring into action but
 * requires that the environment variable `REACT_APP_DEMO_MODE` is
 * set to true.
 * Otherwise, some aspects of the app might break such as authentication
 * because the authentication components also must be slightly modified.
 *
 * This file exports some components that must be used in-place of their
 * non-demo counterparts. For now, it only exports an alternate version
 * of the Routes components in which the `Auth` component is replaced with one
 * that forces the user to log in as the demo user.
 */
import Demo from './demo';

const exports = {} as Record<string, any>;

if (!process.env.REACT_APP_DEMO_MODE) {
  console.info('You can activate the demo mode by' +
   'setting REACT_APP_DEMO_MODE to true');
} else {
  console.log('RUNNING IN DEMO MODE');

  // Wrap axios to intercept requests
  Demo.initialize();
}

export default exports;
