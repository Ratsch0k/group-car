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
import {CloseableDialogTitle} from 'lib';
import {useInvites} from 'lib/hooks/useInvites';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useAppDispatch} from 'lib/redux/hooks';
import {closeModal} from 'lib/redux/slices/modalRouter/modalRouterSlice';
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

/**
 * Invites modal for managing invites of user.
 */
export const Invites: React.FC = () => {
  const {invites, refresh, deleteInvite, acceptInvite} = useInvites();
  const {t} = useTranslation();
  const classes = useStyles();
  const dispatch = useAppDispatch();

  // Refresh invites on first render
  useEffect(() => {
    refresh();
    // eslint-disable-next-line
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
        <Typography color='textSecondary' align='center'>
          {t('modals.invites.empty')}
        </Typography>
      </Box>
    );
  }

  return (
    <Dialog
      open={true}
      fullWidth
      maxWidth='sm'
      onBackdropClick={() => dispatch(closeModal())}
    >
      <CloseableDialogTitle close={() => dispatch(closeModal())}>
        {t('modals.invites.title')}
      </CloseableDialogTitle>
      <DialogContent>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default Invites;
