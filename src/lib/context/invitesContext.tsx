import {
  useApi,
  InviteWithGroupAndInviteSender,
  NotDefinedError,
  useGroups,
} from 'lib';
import {useAppSelector} from 'lib/redux/hooks';
import {getIsLoggedIn} from 'lib/redux/slices/auth/authSelectors';
import React, {useEffect, useState} from 'react';

export interface InvitesContext {
  /**
   * List of invites.
   */
  invites: InviteWithGroupAndInviteSender[];
  /**
   * Reload all invites.
   */
  refresh(): Promise<void>;
  /**
   * Deletes all invites which are for the specified group.
   * @param groupId GroupId of the invite which should be deleted.
   */
  deleteInvite(groupId: number): Promise<void>;
  /**
   * Accept the invite for the specified group.
   * @param groupId The id of the group
   */
  acceptInvite(groupId: number): Promise<void>;
}

export const InvitesContext = React.createContext<InvitesContext>({
  invites: [],
  refresh: () => Promise.reject(new NotDefinedError()),
  deleteInvite: () => Promise.reject(new NotDefinedError()),
  acceptInvite: () => Promise.reject(new NotDefinedError()),
});
InvitesContext.displayName = 'InvitesContext';

/**
 * Props for invite context provider.
 */
export interface InvitesProviderProps {
  /**
   * The interval in which invites should be retrieved.
   * Default is 10 seconds.
   */
  interval?: number;
}

/**
 * Provider for the invite context.
 * @param props Props
 */
export const InvitesProvider: React.FC<InvitesProviderProps> = (props) => {
  const [invites, setInvites] = useState<InvitesContext['invites']>([]);
  const {getInvitesOfUser, acceptInvite: acceptInviteApi} = useApi();
  const isLoggedIn = useAppSelector(getIsLoggedIn);
  const interval = props.interval || 1000 * 10; // 10 seconds
  const {update: updateGroups} = useGroups();
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();

  const refresh = () => {
    return getInvitesOfUser().then((res) => {
      setInvites(res.data.invites);
    });
  };

  const deleteInvite = (groupId: number): Promise<void> => {
    // TODO: Replace with api call if available
    return new Promise((resolve) => {
      setInvites((prev) =>
        prev.filter((invite) => invite.groupId !== groupId));
      resolve();
    });
  };

  const acceptInvite = async (groupId: number): Promise<void> => {
    await acceptInviteApi(groupId);
    setInvites((prev) => prev.filter((invite) => invite.groupId !== groupId));
    await updateGroups();
  };

  useEffect(() => {
    if (isLoggedIn) {
      refresh();
      if (intervalId) {
        clearInterval(intervalId);
      }

      setIntervalId(setInterval(() => {
        refresh();
      }, interval));
    } else {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(undefined);
      }
      setInvites([]);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
    // eslint-disable-next-line
  }, [interval, isLoggedIn]);

  return (
    <InvitesContext.Provider value={{
      invites,
      refresh,
      deleteInvite,
      acceptInvite,
    }}>
      {props.children}
    </InvitesContext.Provider>
  );
};

export default InvitesProvider;
