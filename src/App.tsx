import React from 'react';
import GroupCar from './GroupCar';
import {BrowserRouter} from 'react-router-dom';
import {ThemeProvider} from '@material-ui/core';
import {
  theme,
  AuthProvider,
  ModalRouter,
  AxiosProvider,
} from 'lib';
import Routes from 'modals';

const App: React.FC = () => {
  return (
    <AxiosProvider>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <ModalRouter>
            <AuthProvider>
              <GroupCar />
              <Routes />
            </AuthProvider>
          </ModalRouter>
        </BrowserRouter>
      </ThemeProvider>
    </AxiosProvider>
  );
};

export default App;
