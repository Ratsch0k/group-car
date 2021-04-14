import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import rootReducer from './slices';
import {
  connectRouter,
  routerMiddleware,
} from 'connected-react-router';
import {createBrowserHistory} from 'history';

export const history = createBrowserHistory();


/**
 * Create redux store.
 */
const store = configureStore({
  reducer: {
    ...rootReducer,
    router: connectRouter(history),
  },
  devTools: true,
  middleware: getDefaultMiddleware().concat(routerMiddleware(history)),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
