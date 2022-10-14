import React from 'react';
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
import PermissionHandler from 'lib/context';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <ConnectedRouter history={history}>
            <ModalRouter>
              <AuthChecker>
                <PermissionHandler>
                  <MapProvider>
                    <GroupUpdater>
                      <InvitesUpdater>
                        <Routes />
                        <ModalRoutes />
                      </InvitesUpdater>
                    </GroupUpdater>
                  </MapProvider>
                </PermissionHandler>
              </AuthChecker>
            </ModalRouter>
          </ConnectedRouter>
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
