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
} from 'lib';
import ModalRoutes from 'modals';

const App: React.FC = () => {
  return (
    <AxiosProvider>
      <ApiProvider>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <ModalRouter>
              <AuthProvider>
                <GroupCar />
                <ModalRoutes />
                <AxiosErrorHandler />
              </AuthProvider>
            </ModalRouter>
          </BrowserRouter>
        </ThemeProvider>
      </ApiProvider>
    </AxiosProvider>
  );
};

export default App;
