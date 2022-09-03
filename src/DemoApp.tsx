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
import Routes from './pages';
import ModalRoutes from './modals';


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
                      <Routes />
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
