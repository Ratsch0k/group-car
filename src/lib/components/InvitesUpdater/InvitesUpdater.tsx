import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from 'lib/redux/hooks';
import {getIsLoggedIn} from 'lib/redux/slices/auth';
import {getInvites} from 'lib/redux/slices/invites';
import config from 'config';

/**
 * Updates invites of the currently logged in user in
 * a regular interval.
 * @param param0 Only children
 * @returns Functional component
 */
export const InvitesUpdater: React.FC = ({children}) => {
  const isLoggedIn = useAppSelector(getIsLoggedIn);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();
  const dispatch = useAppDispatch();

  /**
   * Gets invites and starts interval to check
   * regularly if user is logged in.
   */
  useEffect(() => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(undefined);
    }

    if (isLoggedIn) {
      dispatch(getInvites());
      const id = setInterval(() => {
        dispatch(getInvites());
      }, config.invites.checkInterval);
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
