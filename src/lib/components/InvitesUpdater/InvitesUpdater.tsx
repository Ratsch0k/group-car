import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from 'lib/redux/hooks';
import {getIsLoggedIn} from 'lib/redux/slices/auth';
import {getInvites} from 'lib/redux/slices/invites';

const UPDATE_INTERVAL = 10000; // 10 seconds

export const InvitesUpdater: React.FC = ({children}) => {
  const isLoggedIn = useAppSelector(getIsLoggedIn);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(undefined);
    }

    if (isLoggedIn) {
      dispatch(getInvites());
      const id = setInterval(() => {
        dispatch(getInvites());
      }, UPDATE_INTERVAL);
      setIntervalId(id);
    }
  }, [isLoggedIn]);

  return (
    <>
      {children}
    </>
  );
};

export default InvitesUpdater;
