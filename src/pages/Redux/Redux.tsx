import {Button} from '@material-ui/core';
import React from 'react';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {authSelector, login, logout} from 'redux/slices/auth/authSlice';
import {
  decrement,
  groupSelector,
  increment,
} from 'redux/slices/group/groupSlice';

export const Redux: React.FC = () => {
  const isLoggedIn = useAppSelector(authSelector);
  const groupTest = useAppSelector(groupSelector);
  const dispatch = useAppDispatch();

  return (
    <div>
      <div>
        <div>
        User is{isLoggedIn ? '' : ' not'} logged in
        </div>
        <Button onClick={
          () => isLoggedIn ? dispatch(logout()) : dispatch(login())
        }>
          {isLoggedIn ? 'Log out' : 'Log in'}
        </Button>
      </div>
      <br />
      <div>
        Counter: {groupTest}
      </div>
      <Button onClick={() => dispatch(increment())}>
        INCREMENT
      </Button>
      <Button onClick={() => dispatch(decrement())}>
        DECREMENT
      </Button>
    </div>
  );
};

export default Redux;
