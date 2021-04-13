import {AnyAction} from 'redux';

export const isPendingMatcher = (action: AnyAction): boolean => {
  return (action.type as string).endsWith('/pending');
};

export const isCompletedMatcher = (action: AnyAction): boolean => {
  return (action.type as string)
    .match(/^.+(\/rejected|\/fulfilled)$/) !== null;
};
