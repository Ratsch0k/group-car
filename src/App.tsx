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
  AxiosErrorHandler,
  InvitesProvider,
} from 'lib';
import ModalRoutes from 'modals';
import GroupProvider from 'lib/context/groupContext';

const App: React.FC = () => {
  return (
    <AxiosProvider>
      <ApiProvider>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <ModalRouter>
              <AuthProvider>
                <GroupProvider>
                  <InvitesProvider>
                    <GroupCar />
                    <ModalRoutes />
                    <AxiosErrorHandler />
                  </InvitesProvider>
                </GroupProvider>
              </AuthProvider>
            </ModalRouter>
          </BrowserRouter>
        </ThemeProvider>
      </ApiProvider>
    </AxiosProvider>
  );
};

export default App;
