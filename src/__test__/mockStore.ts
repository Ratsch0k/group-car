/* eslint-disable @typescript-eslint/ban-types */
import {RootState} from '../lib/redux/store';
import thunk, {ThunkDispatch} from 'redux-thunk';
import {
  initialState as authState,
} from '../lib/redux/slices/auth/authSlice';
import {
  initialState as groupState,
} from '../lib/redux/slices/group/groupSlice';
import {
  initialState as invitesState,
} from '../lib/redux/slices/invites/invitesSlice';
import configureMockStore, {
  MockStoreCreator,
  MockStoreEnhanced,
} from 'redux-mock-store';
import {AnyAction, Middleware} from '@reduxjs/toolkit';

const defaultState: RootState = {
  router: {
    action: 'POP',
    location: {
      pathname: '/',
      search: '',
      hash: '',
      query: {},
      state: undefined,
    },
  },
  auth: authState,
  group: groupState,
  invites: invitesState,
};

type DispatchExts = ThunkDispatch<RootState, undefined, AnyAction>;


/**
 * Creates a mock store.
 * @param state Initial state. Will be merged with the default initial state.
 * @returns The mocked store
 */
function mockStore(state?: Partial<RootState>):
MockStoreEnhanced<RootState, DispatchExts> {
  const middlewares: Array<Middleware> = [thunk];
  const mockStoreCreator: MockStoreCreator<RootState, DispatchExts> =
  configureMockStore<RootState, DispatchExts>(middlewares);
  const initialState: RootState = {
    ...defaultState,
    ...state,
  };
  const store = mockStoreCreator(initialState);

  return store;
}

export default mockStore;
