import React from 'react';
import 'lib/demo';
import {ThemeProvider} from '@material-ui/core';
import {
  theme,
  AuthChecker,
  ModalRouter,
  MapProvider,
  GroupUpdater,
  SnackbarProvider,
  InvitesUpdater,
} from 'lib';
import {Provider} from 'react-redux';
import store from './lib/redux/store';
import history from 'lib/redux/history';
import {ConnectedRouter} from 'connected-react-router';
import ModalRoutes from './modals';
import GroupCar from 'pages/GroupCar';
import {Route, Switch} from 'react-router-dom';
import DemoAuthentication from './lib/demo/DemoAuthentication';

const DemoRoutes = () => {
  return (
    <Switch>
      <Route path='/auth'>
        <DemoAuthentication />
      </Route>
      <Route path='/'>
        <GroupCar/>
      </Route>
    </Switch>
  );
};

const DemoApp: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <ConnectedRouter history={history}>
            <ModalRouter>
              <AuthChecker>
                <MapProvider>
                  <GroupUpdater>
                    <InvitesUpdater>
                      <DemoRoutes />
                      <ModalRoutes />
                    </InvitesUpdater>
                  </GroupUpdater>
                </MapProvider>
              </AuthChecker>
            </ModalRouter>
          </ConnectedRouter>
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default DemoApp;
