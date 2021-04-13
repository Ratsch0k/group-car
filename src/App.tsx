import React from 'react';
import GroupCar from './GroupCar';
import {ThemeProvider} from '@material-ui/core';
import {
  theme,
  AuthProvider,
  ModalRouter,
  InvitesProvider,
  MapProvider,
  GroupProvider,
  SnackbarProvider,
} from 'lib';
import ModalRoutes from 'modals';
import {Provider} from 'react-redux';
import store, {history} from './redux/store';
import {ConnectedRouter} from 'connected-react-router';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <ConnectedRouter history={history}>
            <ModalRouter>
              <AuthProvider>
                <MapProvider>
                  <GroupProvider>
                    <InvitesProvider>
                      <GroupCar />
                      <ModalRoutes />
                    </InvitesProvider>
                  </GroupProvider>
                </MapProvider>
              </AuthProvider>
            </ModalRouter>
          </ConnectedRouter>
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
