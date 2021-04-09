import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react';
import UserOverview from './UserOverview';
import {ThemeProvider} from '@material-ui/core';
import {AuthContext} from 'lib';
import theme from '../../../__test__/testTheme';


it('renders and matches snapshot when user is not logged in', () => {
  const fakeContext = {
    login: jest.fn(),
    signUp: jest.fn(),
    logout: jest.fn(),
    user: undefined,
    isLoggedIn: false,
    openAuthDialog: jest.fn(),
  };

  const {container} = render(
      <ThemeProvider theme={theme}>
        <AuthContext.Provider value={fakeContext}>
          <UserOverview />
        </AuthContext.Provider>
      </ThemeProvider>,
  );

  expect(container).toMatchSnapshot();
  expect(fakeContext.login).not.toHaveBeenCalled();
  expect(fakeContext.signUp).not.toHaveBeenCalled();
  expect(fakeContext.logout).not.toHaveBeenCalled();
  expect(fakeContext.openAuthDialog).not.toHaveBeenCalled();
});

it('renders and matches snapshot when user is logged in', () => {
  const fakeUser = {
    id: 12,
    username: 'TEST',
    email: 'TEST@mail.com',
    isBetaUser: false,
  };

  const fakeContext = {
    login: jest.fn(),
    signUp: jest.fn(),
    logout: jest.fn(),
    user: fakeUser,
    isLoggedIn: true,
    openAuthDialog: jest.fn(),
  };

  const {container} = render(
      <ThemeProvider theme={theme}>
        <AuthContext.Provider value={fakeContext}>
          <UserOverview />
        </AuthContext.Provider>
      </ThemeProvider>,
  );

  expect(container).toMatchSnapshot();
  expect(fakeContext.login).not.toHaveBeenCalled();
  expect(fakeContext.signUp).not.toHaveBeenCalled();
  expect(fakeContext.logout).not.toHaveBeenCalled();
  expect(fakeContext.openAuthDialog).not.toHaveBeenCalled();
});

it('logout calls props.onClose and auth.logout', () => {
  const fakeUser = {
    id: 12,
    username: 'TEST',
    email: 'TEST@MAIL.COM',
    isBetaUser: false,
  };

  const fakeContext = {
    login: jest.fn(),
    signUp: jest.fn(),
    logout: jest.fn(),
    user: fakeUser,
    isLoggedIn: true,
    openAuthDialog: jest.fn(),
  };

  const onClose = jest.fn();

  render(
      <ThemeProvider theme={theme}>
        <AuthContext.Provider value={fakeContext}>
          <UserOverview onClose={onClose}/>
        </AuthContext.Provider>
      </ThemeProvider>,
  );

  fireEvent.click(screen.getByTestId('logout-button'));

  expect(fakeContext.login).not.toHaveBeenCalled();
  expect(fakeContext.signUp).not.toHaveBeenCalled();
  expect(fakeContext.logout).toHaveBeenCalledTimes(1);
  expect(fakeContext.openAuthDialog).not.toHaveBeenCalled();
  expect(onClose).toHaveBeenCalled();
});
