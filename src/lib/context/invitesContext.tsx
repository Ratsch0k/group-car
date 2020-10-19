import {useApi, InviteWithGroupAndInviteSender, useAuth} from 'lib';
import { useGroups } from 'lib/hooks';
import React, {useEffect, useState} from 'react';

export interface InvitesContext {
  /**
   * List of invites.
   */
  invites: (InviteWithGroupAndInviteSender)[];
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
  refresh: () => Promise.reject(new Error('Not yet defined')),
  deleteInvite: () => Promise.reject(new Error('Not yet defined')),
  acceptInvite: () => Promise.reject(new Error('Not yet defined')),
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
  const {isLoggedIn} = useAuth();
  const interval = props.interval || 1000 * 10; // 10 seconds
  const {update: updateGroups} = useGroups();

  const refresh = () => {
    return getInvitesOfUser().then((res) => {
      setInvites(res.data.invites);
    });
  };

  const deleteInvite = (groupId: number): Promise<void> => {
    // TODO: Replace with api call if available
    return new Promise((resolve, reject) => {
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
    let id: NodeJS.Timeout;
    if (isLoggedIn) {
      refresh();
      id = setInterval(() => {
        refresh();
      }, interval);
    } else {
      setInvites([]);
    }

    return () => {
      if (id) {
        clearInterval(id);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interval, getInvitesOfUser, isLoggedIn]);

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
