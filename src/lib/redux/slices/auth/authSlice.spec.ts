import {configureStore, EnhancedStore} from '@reduxjs/toolkit';
import reducer, {
  AuthState,
  reset,
  setSignUpRequestSent,
  setUser,
} from './authSlice';

describe('authReducer', () => {
  let store: EnhancedStore<{auth: AuthState}>;

  beforeEach(() => {
    store = configureStore({reducer: {auth: reducer}});
  });

  describe('setUser', () => {
    it('sets user to payload', () => {
      expect(store.getState().auth.user).toBeUndefined();

      const user = {
        id: 1,
        username: 'user',
        email: 'user@mail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        isBetaUser: false,
      };
      store.dispatch(setUser(user));

      expect(store.getState().auth.user).toEqual(user);
    });
  });

  describe('reset', () => {
    it('resets state to initial state', () => {
      const user = {
        id: 1,
        username: 'user',
        email: 'user@mail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        isBetaUser: false,
      };
      store.dispatch(setUser(user));
      store.dispatch(setSignUpRequestSent(true));

      expect(store.getState().auth.user).toEqual(user);
      expect(store.getState().auth.signUpRequestSent).toEqual(true);

      store.dispatch(reset());

      expect(store.getState().auth.user).toBeUndefined();
      expect(store.getState().auth.signUpRequestSent).toEqual(false);
    });
  });

  describe('setSignUpRequestSent', () => {
    it('sets signUpRequestSent to payload', () => {
      expect(store.getState().auth.signUpRequestSent).toBe(false);
      store.dispatch(setSignUpRequestSent(true));
      expect(store.getState().auth.signUpRequestSent).toBe(true);
      store.dispatch(setSignUpRequestSent(false));
      expect(store.getState().auth.signUpRequestSent).toBe(false);
    });
  });

  describe('extraReducers', () => {
    it('matcher for pending thunks sets loading to true', () => {
      expect(store.getState().auth.loading).toBe(false);

      store.dispatch({
        type: 'auth/action/pending',
        payload: undefined,
      });

      expect(store.getState().auth.loading).toBe(true);
    });

    it('matcher for completed thunks sets loading to false', () => {
      expect(store.getState().auth.loading).toBe(false);

      store.dispatch({
        type: 'auth/action/pending',
        payload: undefined,
      });

      expect(store.getState().auth.loading).toBe(true);

      store.dispatch({
        type: 'auth/action/fulfilled',
        payload: undefined,
      });

      expect(store.getState().auth.loading).toBe(false);

      store.dispatch({
        type: 'auth/action/pending',
        payload: undefined,
      });

      expect(store.getState().auth.loading).toBe(true);

      store.dispatch({
        type: 'auth/action/rejected',
        payload: undefined,
      });

      expect(store.getState().auth.loading).toBe(false);
    });
  });
});
