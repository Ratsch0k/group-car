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
} from 'lib';
import ModalRoutes from 'modals';
import GroupProvider from 'lib/context/groupContext';
import SnackbarProvider from 'lib/context/snackbarContext';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <AxiosProvider>
          <ApiProvider>
            <BrowserRouter>
              <ModalRouter>
                <AuthProvider>
                  <GroupProvider>
                    <InvitesProvider>
                      <GroupCar />
                      <ModalRoutes />
                    </InvitesProvider>
                  </GroupProvider>
                </AuthProvider>
              </ModalRouter>
            </BrowserRouter>
          </ApiProvider>
        </AxiosProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
