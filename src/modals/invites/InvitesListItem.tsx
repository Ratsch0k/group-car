import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Grid,
  Button,
  CircularProgress,
  Box,
  Theme,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import {createStyles, makeStyles} from '@material-ui/styles';
import {InviteWithGroupAndInviteSender, useInvites} from 'lib';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';

/**
 * Props for the InvitesListItem
 */
export interface InvitesListItemProps {
  /**
   * The invite of this item.
   */
  invite: InviteWithGroupAndInviteSender;
  /**
   * Delete this invite from the list.
   */
  delete(): Promise<void>;
  /**
   * Accept this invite.
   */
  accept(): Promise<void>
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
    twoLinesSecondaryAction: {
      position: 'unset',
      marginTop: theme.spacing(2),
      marginLeft: theme.spacing(2),
    },
  }),
);

/**
 * Represents one list item in the invite list.
 */
export const InvitesListItem: React.FC<InvitesListItemProps> =
(props: InvitesListItemProps) => {
  const {t} = useTranslation();
  // eslint-disable-next-line
  const {invite, delete: deleteSelf, accept} = props;
  const {refresh} = useInvites();
  const [loading, setLoading] = useState<boolean>(false);
  const classes = useStyles();
  const theme = useTheme();
  const smallerSm = useMediaQuery(theme.breakpoints.down('sm'));
  const listItemRef = useRef<HTMLLIElement>(null);
  const [listItemHeight, setListItemHeight] = useState<number>(4);

  const handleAccept = () => {
    setLoading(true);
    accept().then(() => {
      setLoading(false);
      refresh();
    }).catch(() => {
      setLoading(false);
    });
  };

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
      <ListItemSecondaryAction
        classes={{
          root: smallerSm ? classes.twoLinesSecondaryAction : undefined,
        }}
      >
        <Grid container spacing={1}>
          <Grid item>
            <Button
              color='primary'
              variant='outlined'
              disabled={loading}
              onClick={handleAccept}
              id={`invite-${invite.groupId}-accept-btn`}
            >
              {t('misc.accept')}
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant='outlined'
              disabled
              id={`invite-${invite.groupId}-delete-btn`}
            >
              {t('misc.delete')}
            </Button>
          </Grid>
        </Grid>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default InvitesListItem;
