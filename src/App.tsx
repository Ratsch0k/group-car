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

const App: React.FC = () => {
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

export default App;
