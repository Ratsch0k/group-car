import {configureStore, EnhancedStore} from '@reduxjs/toolkit';
import reducer, {setSignUpRequestSent, setUser} from './authSlice';
import {User} from '../../../../typings';
import {
  getAuthState,
  getIsLoading,
  getIsLoggedIn,
  getSignUpRequestSent,
  getUser,
} from './authSelectors';
import {RootState} from '../../store';

describe('authSelectors', () => {
  let store: EnhancedStore<RootState>;
  let user: User;

  beforeEach(() => {
    store = configureStore(
      {reducer: {auth: reducer}},
    ) as EnhancedStore<RootState>;

    user = {
      id: 1,
      username: 'user',
      email: 'user@mail.com',
      createdAt: new Date().toUTCString(),
      updatedAt: new Date().toUTCString(),
      isBetaUser: false,
    };
  });

  it('getAuthState returns complete auth state', () => {
    const authState = getAuthState(store.getState() as RootState);

    expect(authState).toEqual({
      user: undefined,
      loading: false,
      signUpRequestSent: false,
    });
  });

  it('getUser returns the user value', () => {
    store.dispatch(setUser(user));

    const actualUser = getUser(store.getState() as RootState);

    expect(actualUser).toEqual(user);
  });

  it('getIsLoading returns the loading value', () => {
    expect(getIsLoading(store.getState())).toBe(false);
    /*
     * Dispatch non existing action but
     * which would match extra reducer which set loading to true
     */
    store.dispatch({
      type: 'auth/action/pending',
      payload: undefined,
    });

    expect(getIsLoading(store.getState())).toBe(true);
  });

  it('getSignUpRequestSent returns the signUpRequestSent value', () => {
    expect(getSignUpRequestSent(store.getState())).toBe(false);

    store.dispatch(setSignUpRequestSent(true));

    expect(getSignUpRequestSent(store.getState())).toBe(true);
  });

  describe('getIsLoggedIn', () => {
    it('returns true if the user field is not undefined', () => {
      store.dispatch(setUser(user));

      const state = store.getState();

      expect(state.auth.user).toEqual(user);
      expect(getIsLoggedIn(state)).toBe(true);
    });

    it('returns false if the user field is undefined', () => {
      const state = store.getState();

      expect(state.auth.user).toBeUndefined();
      expect(getIsLoggedIn(state)).toBe(false);
    });
  });
});
