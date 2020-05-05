import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import AuthenticationDialog from './AuthenticationDialog';
import {MemoryRouter} from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import AuthContext from '../../context/auth/authContext';

it('renders without crashing', () => {
  render(
      <MemoryRouter>
        <AuthenticationDialog open={true} close={() => {}}/>
      </MemoryRouter>);
});

it('matches snapshot', async () => {
  const {baseElement} = render(
      <MemoryRouter>
        <AuthenticationDialog open={true} close={() => {}}/>
      </MemoryRouter>);

  expect(baseElement).toMatchSnapshot();
});

it('sign up button navigates to correct url', () => {
  const {baseElement} = render(
      <MemoryRouter>
        <AuthenticationDialog open={true} close={() => {}}/>
      </MemoryRouter>);

  screen.getByTestId('to-signup');
  screen.getByTestId('to-login');

  expect(baseElement).toMatchSnapshot();

  fireEvent.click(screen.getByTestId('to-signup'));

  expect(screen.queryByTestId('to-signup')).toBeNull();
  expect(screen.queryByTestId('to-login')).toBeNull();

  // Check if all inputs are in body
  expect(baseElement.querySelector('#signup-email')).not.toBeNull();
  expect(baseElement.querySelector('#signup-password')).not.toBeNull();
  expect(baseElement.querySelector('#signup-username')).not.toBeNull();

  expect(baseElement).toMatchSnapshot();
});

it('login button navigates to correct url', () => {
  const {baseElement} = render(
      <MemoryRouter>
        <AuthenticationDialog open={true} close={() => {}}/>
      </MemoryRouter>);

  screen.getByTestId('to-signup');
  screen.getByTestId('to-login');

  expect(baseElement).toMatchSnapshot();

  fireEvent.click(screen.getByTestId('to-login'));

  expect(screen.queryByTestId('to-signup')).toBeNull();
  expect(screen.queryByTestId('to-login')).toBeNull();

  // Check if all inputs are in body
  expect(baseElement.querySelector('#login-password')).not.toBeNull();
  expect(baseElement.querySelector('#login-username')).not.toBeNull();

  expect(baseElement).toMatchSnapshot();
});

it('back button button navigates back from form', () => {
  const {baseElement} = render(
      <MemoryRouter>
        <AuthenticationDialog open={true} close={() => {}}/>
      </MemoryRouter>);

  screen.getByTestId('to-signup');
  screen.getByTestId('to-login');

  expect(baseElement).toMatchSnapshot();

  fireEvent.click(screen.getByTestId('to-login'));

  expect(screen.queryByTestId('to-signup')).toBeNull();
  expect(screen.queryByTestId('to-login')).toBeNull();

  // Check if all inputs are in body
  expect(baseElement.querySelector('#login-password')).not.toBeNull();
  expect(baseElement.querySelector('#login-username')).not.toBeNull();

  expect(baseElement).toMatchSnapshot();

  fireEvent.click(screen.getByTestId('go-back'));

  screen.getByTestId('to-signup');
  screen.getByTestId('to-login');

  expect(baseElement).toMatchSnapshot();
});

it('if user logged in redirect to last origin', () => {
  // Fake auth context
  const login = jest.fn();
  const logout = jest.fn();

  const {baseElement} = render(
      <MemoryRouter>
        <AuthContext.Provider value={{
          isLoggedIn: true,
          login,
          logout,
          user: undefined,
          openAuthDialog: () => {},
        }}>
          <AuthenticationDialog open={true} close={() => {}}/>
        </AuthContext.Provider>
      </MemoryRouter>,
  );

  expect(screen.queryByAltText('to-signup')).toBeNull();
  expect(screen.queryByAltText('to-login')).toBeNull();
  expect(baseElement.querySelector('#login-username')).toBeNull();
  expect(baseElement.querySelector('#login-password')).toBeNull();
  expect(baseElement.querySelector('#signup-username')).toBeNull();
  expect(baseElement.querySelector('#signup-email')).toBeNull();
  expect(baseElement.querySelector('#signup-password')).toBeNull();

  expect(baseElement).toMatchSnapshot();
});
