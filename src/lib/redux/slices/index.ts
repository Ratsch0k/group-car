import {connectRouter} from 'connected-react-router';
import {History} from 'history';
import authReducer from './auth/authSlice';
import groupReducer from './group/groupSlice';
import invitesReducer from './invites/invitesSlice';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const rootReducers = (history: History) => {
  return {
    group: groupReducer,
    auth: authReducer,
    invites: invitesReducer,
    router: connectRouter(history),
  };
};

export default rootReducers;
