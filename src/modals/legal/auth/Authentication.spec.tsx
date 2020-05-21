import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import AuthenticationDialog from './AuthenticationDialog';
import {MemoryRouter, Route} from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import AuthContext from '../../../lib/context/auth/authContext';
import {ModalProvider} from 'lib/ModalRouter';

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
  const close = jest.fn();
  const goTo = jest.fn();
  const route = '/auth';

  const {baseElement} = render(
      <MemoryRouter initialEntries={['/auth']}>
        <ModalProvider close={close} goTo={goTo} route={route}>
          <Route path='/auth'>
            <AuthenticationDialog open={true} close={() => {}}/>
          </Route>
        </ModalProvider>
      </MemoryRouter>,
  );

  expect(baseElement).toMatchSnapshot();

  expect(baseElement.querySelector('#auth-to-signup')).not.toBeNull();
  expect(baseElement.querySelector('#auth-to-login')).not.toBeNull();

  fireEvent.click(baseElement.querySelector('#auth-to-signup')!);

  expect(goTo).toHaveBeenCalledTimes(1);
  expect(goTo).toHaveBeenCalledWith('/auth/sign-up');
  expect(close).not.toHaveBeenCalled();
});

it('login button navigates to correct url', () => {
  const close = jest.fn();
  const goTo = jest.fn();
  const route = '/auth';

  const {baseElement} = render(
      <MemoryRouter initialEntries={['/auth']}>
        <ModalProvider close={close} goTo={goTo} route={route}>
          <Route path='/auth'>
            <AuthenticationDialog open={true} close={() => {}}/>
          </Route>
        </ModalProvider>
      </MemoryRouter>,
  );

  expect(baseElement).toMatchSnapshot();

  expect(baseElement.querySelector('#auth-to-signup')).not.toBeNull();
  expect(baseElement.querySelector('#auth-to-login')).not.toBeNull();

  fireEvent.click(baseElement.querySelector('#auth-to-login')!);

  expect(goTo).toHaveBeenCalledTimes(1);
  expect(goTo).toHaveBeenCalledWith('/auth/login');
  expect(close).not.toHaveBeenCalled();
});

it('back button button navigates back from form', () => {
  const close = jest.fn();
  const goTo = jest.fn();
  const route = '/auth/login';

  const {baseElement} = render(
      <MemoryRouter initialEntries={['/auth/login']}>
        <ModalProvider close={close} goTo={goTo} route={route}>
          <Route path='/auth'>
            <AuthenticationDialog open={true} close={() => {}}/>
          </Route>
        </ModalProvider>
      </MemoryRouter>,
  );

  expect(baseElement).toMatchSnapshot();

  expect(baseElement.querySelector('#auth-to-signup')).toBeNull();
  expect(baseElement.querySelector('#auth-to-login')).toBeNull();
  expect(baseElement.querySelector('#login-submit')).not.toBeNull();
  expect(baseElement.querySelector('#signup-submit')).toBeNull();

  fireEvent.click(baseElement.querySelector('#auth-go-back')!);

  expect(goTo).toHaveBeenCalledTimes(1);
  expect(goTo).toHaveBeenCalledWith(undefined);
  expect(close).not.toHaveBeenCalled();
});

it('if user logged in redirect to last origin', () => {
  // Fake auth context
  const login = jest.fn();
  const logout = jest.fn();
  const signUp = jest.fn();

  const {baseElement} = render(
      <MemoryRouter>
        <AuthContext.Provider value={{
          isLoggedIn: true,
          login,
          logout,
          signUp,
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
