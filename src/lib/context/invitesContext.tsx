import {useApi, Invite, InviteGroup, useAuth} from 'lib';
import React, {useEffect, useState} from 'react';

export interface InvitesContext {
  invites: (Invite & InviteGroup)[];
}

export const InvitesContext = React.createContext<InvitesContext>({
  invites: [],
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
  const {getInvitesOfUser} = useApi();
  const {isLoggedIn} = useAuth();
  const interval = props.interval || 1000 * 10; // 10 seconds

  useEffect(() => {
    let id: NodeJS.Timeout;
    if (isLoggedIn) {
      getInvitesOfUser().then((res) => {
        setInvites(res.data.invites);
      });
      id = setInterval(() => {
        getInvitesOfUser().then((res) => {
          setInvites(res.data.invites);
        });
      }, interval);
    } else {
      setInvites([]);
    }

    return () => {
      if (id) {
        clearInterval(id);
      }
    };
  }, [interval, getInvitesOfUser, isLoggedIn]);

  return (
    <InvitesContext.Provider value={{invites}}>
      {props.children}
    </InvitesContext.Provider>
  );
};

export default InvitesProvider;
