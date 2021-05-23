import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import rootReducers from './slices';
import {
  routerMiddleware,
} from 'connected-react-router';
import history from 'lib/redux/history';
import * as Sentry from '@sentry/react';

const sentryReduxEnhancer = Sentry.createReduxEnhancer({
  actionTransformer: (action) => {
    return action;
  },
  stateTransformer: (state) => {
    return state;
  },
});


/**
 * Create redux store.
 */
const store = configureStore({
  reducer: rootReducers(history),
  devTools: true,
  middleware: getDefaultMiddleware().concat(routerMiddleware(history)),
  enhancers: [sentryReduxEnhancer],
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
