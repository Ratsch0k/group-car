import React from 'react';
import {render, waitFor} from '@testing-library/react';
import { ApiContext, Api } from './apiContext';
import AuthProvider, { AuthContext } from './authContext';
import {ModalContext} from '../ModalRouter/ModalRouteContext';



describe('AuthProvider', () => {
  const fakeUser = {
    username: 'TEST',
    email: 'TEST',
    isBetaUser: false,
    id: 10,
  };

  describe('tries to log in user on first render and', () => {
    it('sets data if successful', async () => {
      const fakeApi = {
        checkLoggedIn: jest.fn().mockResolvedValue({data: fakeUser}),
      };
    
      let authContext: AuthContext;
      render(
        <ApiContext.Provider value={fakeApi as unknown as Api}>
          <AuthProvider>
            <AuthContext.Consumer>
              {(context) => {
                authContext = context;
                return (
                  <div>
                    TEST
                  </div>
                );
              }}
            </AuthContext.Consumer>
          </AuthProvider>
        </ApiContext.Provider>
      );

      await waitFor(() => expect(authContext.isLoggedIn).toBe(true));
      expect(fakeApi.checkLoggedIn).toHaveBeenCalledTimes(1);
      expect(authContext.user).toEqual(fakeUser);
    });
    
    it('handles fail', async () => {
      const fakeApi = {
        checkLoggedIn: jest.fn().mockRejectedValue('TEST'),
      };
    
      let authContext: AuthContext;
      render(
        <ApiContext.Provider value={fakeApi as unknown as Api}>
          <AuthProvider>
            <AuthContext.Consumer>
              {(context) => {
                authContext = context;
                return (
                  <div>
                    TEST
                  </div>
                );
              }}
            </AuthContext.Consumer>
          </AuthProvider>
        </ApiContext.Provider>
      );

      await waitFor(() => expect(fakeApi.checkLoggedIn).toHaveBeenCalledTimes(1));
      expect(authContext.user).toBeFalsy;
      expect(authContext.isLoggedIn).toBe(false);
    });
  });

  describe('login', () => {
    it('calls api.login and sets user data if successful', async () => {
      const fakeApi = {
        checkLoggedIn: jest.fn().mockRejectedValue('TEST'),
        login: jest.fn().mockResolvedValue({data: fakeUser}),
      };
    
      let authContext: AuthContext;
      render(
        <ApiContext.Provider value={fakeApi as unknown as Api}>
          <AuthProvider>
            <AuthContext.Consumer>
              {(context) => {
                authContext = context;
                return (
                  <div>
                    {authContext.isLoggedIn}
                  </div>
                );
              }}
            </AuthContext.Consumer>
          </AuthProvider>
        </ApiContext.Provider>
      );

      await waitFor(() => expect(fakeApi.checkLoggedIn).toHaveBeenCalledTimes(1));
      expect(authContext.isLoggedIn).toBe(false);

      const loginResponse = await authContext.login('username', 'password');
      expect(loginResponse.data).toEqual(fakeUser);
      expect(fakeApi.login).toHaveBeenCalledTimes(1);
      expect(fakeApi.login).toHaveBeenCalledWith('username', 'password');
      expect(authContext.isLoggedIn).toBe(true);
      expect(authContext.user).toEqual(fakeUser);
    });
  });

  describe('signUp', () => {
    it('calls api.signUp and sets user data if successful', async () => {
      const fakeApi = {
        checkLoggedIn: jest.fn().mockRejectedValue('TEST'),
        signUp: jest.fn().mockResolvedValue({data: fakeUser}),
      };
    
      let authContext: AuthContext;
      render(
        <ApiContext.Provider value={fakeApi as unknown as Api}>
          <AuthProvider>
            <AuthContext.Consumer>
              {(context) => {
                authContext = context;
                return (
                  <div>
                    {authContext.isLoggedIn}
                  </div>
                );
              }}
            </AuthContext.Consumer>
          </AuthProvider>
        </ApiContext.Provider>
      );

      await waitFor(() => expect(fakeApi.checkLoggedIn).toHaveBeenCalledTimes(1));
      expect(authContext.isLoggedIn).toBe(false);

      const signUpResponse = await authContext.signUp('username', 'email', 'password', 0);
      expect(signUpResponse.data).toEqual(fakeUser);
      expect(fakeApi.signUp).toHaveBeenCalledTimes(1);
      expect(fakeApi.signUp).toHaveBeenCalledWith('username', 'email', 'password', 0);
      expect(authContext.isLoggedIn).toBe(true);
      expect(authContext.user).toEqual(fakeUser);
    });
  });

  describe('logout', () => {
    it('calls api.logout and sets state to not logged in', async () => {
      const fakeApi = {
        checkLoggedIn: jest.fn().mockResolvedValueOnce({data: fakeUser}),
        logout: jest.fn().mockImplementation(() => Promise.resolve()),
      };
    
      let authContext: AuthContext;
      render(
        <ApiContext.Provider value={fakeApi as unknown as Api}>
          <AuthProvider>
            <AuthContext.Consumer>
              {(context) => {
                authContext = context;
                return (
                  <div>
                    {authContext.isLoggedIn}
                  </div>
                );
              }}
            </AuthContext.Consumer>
          </AuthProvider>
        </ApiContext.Provider>
      );

      await waitFor(() => expect(fakeApi.checkLoggedIn).toHaveBeenCalledTimes(1));
      expect(authContext.isLoggedIn).toBe(true);

      await authContext.logout();
      expect(fakeApi.logout).toHaveBeenCalledTimes(1);
      expect(authContext.isLoggedIn).toBe(false);
      expect(authContext.user).toEqual(undefined);
    });
  });

  describe('openAuthDialog', () => {
  it('calls goTo of modal router with path /auth', async () => {
      const fakeApi = {
        checkLoggedIn: jest.fn().mockImplementation(() => Promise.reject()),
      };
      const fakeModelRouter = {
        goTo: jest.fn(),
      }
    
      let authContext: AuthContext;
      render(
        <ModalContext.Provider value={fakeModelRouter as unknown as ModalContext}>
          <ApiContext.Provider value={fakeApi as unknown as Api}>
            <AuthProvider>
              <AuthContext.Consumer>
                {(context) => {
                  authContext = context;
                  return (
                    <div>
                      {authContext.isLoggedIn}
                    </div>
                  );
                }}
              </AuthContext.Consumer>
            </AuthProvider>
          </ApiContext.Provider>
        </ModalContext.Provider>
      );

      await waitFor(() => expect(fakeApi.checkLoggedIn).toHaveBeenCalledTimes(1));
      expect(authContext.isLoggedIn).toBe(false);

      authContext.openAuthDialog();
      expect(fakeModelRouter.goTo).toHaveBeenCalledTimes(1);
      expect(fakeModelRouter.goTo).toHaveBeenCalledWith('/auth');
  });
  });
});