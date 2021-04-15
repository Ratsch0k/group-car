import React from 'react';
import GroupCar from './GroupCar';
import {ThemeProvider} from '@material-ui/core';
import {
  theme,
  AuthChecker,
  ModalRouter,
  InvitesProvider,
  MapProvider,
  GroupUpdater,
  SnackbarProvider,
} from 'lib';
import ModalRoutes from 'modals';
import {Provider} from 'react-redux';
import store from './lib/redux/store';
import history from 'lib/redux/history';
import {ConnectedRouter} from 'connected-react-router';

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
                    <InvitesProvider>
                      <GroupCar />
                      <ModalRoutes />
                    </InvitesProvider>
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
