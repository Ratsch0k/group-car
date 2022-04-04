import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Grid,
  CircularProgress,
  Box,
  Theme,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import {createStyles, makeStyles} from '@material-ui/styles';
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

/**
 * Props for the InvitesListItem
 */
export interface InvitesListItemProps {
  /**
   * The invite of this item.
   */
  invite: InviteWithGroupAndInviteSender;
}

/**
 * Styles.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loaderContainer: {
      position: 'absolute',
      display: 'grid',
      placeItems: 'center',
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.04)',
      borderRadius: theme.shape.borderRadius,
      marginRight: `-${theme.spacing(4)}px`,
      marginLeft: `-${theme.spacing(2)}px`,
    },
    loader: {
      display: 'grid',
      alignItems: 'center',
    },
  }),
);

/**
 * Represents one list item in the invite list.
 */
export const InvitesListItem: React.FC<InvitesListItemProps> =
(props: InvitesListItemProps) => {
  const {t} = useTranslation();
  const {invite} = props;
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useStateIfMounted<boolean>(false);
  const classes = useStyles();
  const theme = useTheme();
  const smallerSm = useMediaQuery(theme.breakpoints.down('sm'));
  const listItemRef = useRef<HTMLLIElement>(null);
  const [listItemHeight, setListItemHeight] = useState<number>(4);

  const handleAccept = useCallback(async () => {
    setLoading(true);
    try {
      await dispatch(acceptInvite(invite.groupId));
    } finally {
      setLoading(false);
    }
  }, [invite]);

  const handleReject = useCallback(async () => {
    setLoading(true);
    try {
      await dispatch(rejectInvite(invite.groupId));
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
      {
        loading &&
        <Box
          className={classes.loaderContainer}
          style={smallerSm ? {
            height: listItemHeight - 4,
            top: 0,
          } : undefined}
        >
          <CircularProgress />
        </Box>
      }
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
              color='error'
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
