import {connectRouter} from 'connected-react-router';
import {History} from 'history';
import authReducer from './auth/authSlice';
import groupReducer from './group/groupSlice';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const rootReducers = (history: History) => {
  return {
    group: groupReducer,
    auth: authReducer,
    router: connectRouter(history),
  };
};

export default rootReducers;
