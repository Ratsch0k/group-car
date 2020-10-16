import {InvitesContext} from 'lib';
import {useContext} from 'react';

/**
 * Shortcut hook for using the invites context.
 */
export const useInvites = (): InvitesContext => {
  return useContext(InvitesContext);
};
