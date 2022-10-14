import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Grid,
} from '@material-ui/core';
import {
  InviteWithGroupAndInviteSender,
  useStateIfMounted,
  IconButton,
} from 'lib';
import {useAppDispatch} from 'lib/redux/hooks';
import {
  acceptInvite,
  rejectInvite,
} from 'lib/redux/slices/invites';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Check, Delete} from '@material-ui/icons';
import InvitesListItemLoader from './InvitesListItemLoader';

/**
 * Props for the InvitesListItem
 */
export interface InvitesListItemProps {
  /**
   * The invite of this item.
   */
  invite: InviteWithGroupAndInviteSender;

  /**
   * Callback to for the element to delete itself.
   */
  deleteSelf: () => void;
}

/**
 * Represents one list item in the invite list.
 */
export const InvitesListItem: React.FC<InvitesListItemProps> =
(props: InvitesListItemProps) => {
  const {t} = useTranslation();
  const {invite, deleteSelf} = props;
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useStateIfMounted<boolean>(false);
  const listItemRef = useRef<HTMLLIElement>(null);
  const [listItemHeight, setListItemHeight] = useState<number>(4);
  const [showAccept, setShowAccept] = useState(false);

  const handleAccept = useCallback(async () => {
    let timeout: NodeJS.Timeout;

    setLoading(true);
    try {
      await dispatch(acceptInvite(invite.groupId));
      setShowAccept(true);
      timeout = setTimeout(() => {
        deleteSelf();
      }, 3000);
    } catch {
      setLoading(false);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [invite]);

  const handleReject = useCallback(async () => {
    setLoading(true);
    try {
      await dispatch(rejectInvite(invite.groupId));
      deleteSelf();
    } finally {
      setLoading(false);
    }
  }, [invite]);

  /**
   * Keep height of loading container equal to size of list item.
   */
  useEffect(() => {
    if (listItemRef.current &&
        listItemRef.current.clientHeight !== listItemHeight) {
      setListItemHeight(listItemRef.current.clientHeight);
    }
    // eslint-disable-next-line
  }, [listItemRef.current?.clientHeight, listItemHeight]);

  return (
    <ListItem
      key={`invite-${invite.groupId}`}
      ref={listItemRef}
    >
      <InvitesListItemLoader
        loading={loading}
        showAccepted={showAccept}
        parentHeight={listItemHeight}
      />
      <ListItemText
        primary={invite.Group.name}
        primaryTypographyProps={{
          color: !loading ? 'textPrimary' : 'textSecondary',
        }}
        secondary={
          t('misc.invitedBy', {
            by: invite.InviteSender.username,
          })
        }
      />
      <ListItemSecondaryAction>
        <Grid container spacing={1}>
          <Grid item>
            <IconButton
              color='primary'
              tooltip={t('misc.accept').toString()}
              disabled={loading}
              onClick={handleAccept}
              id={`invite-${invite.groupId}-accept-btn`}
            >
              <Check />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton
              tooltip={t('misc.delete').toString()}
              disabled={loading}
              onClick={handleReject}
              id={`invite-${invite.groupId}-delete-btn`}
            >
              <Delete />
            </IconButton>
          </Grid>
        </Grid>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default InvitesListItem;
