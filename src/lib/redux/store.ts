import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import rootReducers from './slices';
import {
  routerMiddleware,
} from 'connected-react-router';
import history from 'lib/redux/history';


/**
 * Create redux store.
 */
const store = configureStore({
  reducer: rootReducers(history),
  devTools: true,
  middleware: getDefaultMiddleware().concat(routerMiddleware(history)),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
