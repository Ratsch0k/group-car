import {
  Box,
  Dialog,
  DialogContent,
  Divider,
  List,
  Theme,
  Typography,
} from '@material-ui/core';
import {createStyles, makeStyles} from '@material-ui/styles';
import {CloseableDialogTitle, useModalRouter} from 'lib';
import {useInvites} from 'lib/hooks/useInvites';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import InvitesListItem from './InvitesListItem';

/**
 * Styles.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    emptyContainer: {
      display: 'grid',
      placeItems: 'center',
      padding: theme.spacing(4),
    },
  }),
);

export const Invites: React.FC = () => {
  const {invites, refresh, deleteInvite, acceptInvite} = useInvites();
  const {t} = useTranslation();
  const {close} = useModalRouter();
  const classes = useStyles();

  // Refresh invites on first render
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let content: JSX.Element;
  if (invites.length > 0) {
    content = (
      <List>
        {
          invites.map((invite, index) =>
            <React.Fragment key={`invite-container-${index}`}>
              {
                index > 0 &&
                <Divider />
              }
              <InvitesListItem
                invite={invite}
                delete={() => deleteInvite(invite.groupId)}
                accept={() => acceptInvite(invite.groupId)}
              />
            </React.Fragment>,
          )
        }
      </List>
    );
  } else {
    content = (
      <Box className={classes.emptyContainer}>
        <Typography color='textSecondary'>
          {t('modals.invites.empty')}
        </Typography>
      </Box>
    );
  }

  return (
    <Dialog open={true} fullWidth maxWidth='sm' onBackdropClick={close}>
      <CloseableDialogTitle close={close}>
        {t('modals.invites.title')}
      </CloseableDialogTitle>
      <DialogContent>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default Invites;
