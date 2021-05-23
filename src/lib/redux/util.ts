import {AnyAction} from 'redux';

export const isPendingMatcher = (type = '') => (action: AnyAction): boolean => {
  return (action.type as string).startsWith(type) &&
    (action.type as string).endsWith('/pending');
};

export const isCompletedMatcher = (type ='') =>
  (action: AnyAction): boolean => {
    return (action.type as string).startsWith(type) && (action.type as string)
      .match(/^.+(\/rejected|\/fulfilled)$/) !== null;
  };
