import authReducer from './auth/authSlice';
import groupReducer from './group/groupSlice';

export default {
  group: groupReducer,
  auth: authReducer,
};
