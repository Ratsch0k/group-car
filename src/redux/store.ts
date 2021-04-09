import {configureStore} from '@reduxjs/toolkit';
import rootReducer from './slices';

/**
 * Create redux store.
 */
const store = configureStore({
  reducer: rootReducer,
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
