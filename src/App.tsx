import React from 'react';
import GroupCar from './GroupCar';
import {BrowserRouter} from 'react-router-dom';
import {ThemeProvider} from '@material-ui/core';
import {
  theme,
  AuthProvider,
  ModalRouter,
  AxiosProvider,
  ApiProvider,
  InvitesProvider,
  MapProvider,
  GroupProvider,
  SnackbarProvider,
} from 'lib';
import ModalRoutes from 'modals';
import {Provider} from 'react-redux';
import store from './redux/store';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <AxiosProvider>
            <ApiProvider>
              <BrowserRouter>
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
              </BrowserRouter>
            </ApiProvider>
          </AxiosProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
