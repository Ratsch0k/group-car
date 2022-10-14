import {
  Box,
  Collapse,
  DialogContent,
  Divider,
  List, ModalProps,
  Theme,
  Typography,
} from '@material-ui/core';
import {createStyles, makeStyles} from '@material-ui/styles';
import {
  CloseableDialogTitle,
  Dialog,
  InviteWithGroupAndInviteSender,
} from 'lib';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useShallowAppSelector} from 'lib/redux/hooks';
import {closeModal} from 'lib/redux/slices/modalRouter/modalRouterSlice';
import InvitesListItem from './InvitesListItem';
import {
  getAllInvites,
  getInvites,
} from 'lib/redux/slices/invites';

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
  const currentInvites = useShallowAppSelector(getAllInvites);
  const [invites, setInvites] = useState<InviteWithGroupAndInviteSender[]>(
    currentInvites);
  const {t} = useTranslation();
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [toDelete, setToDelete] = useState(new Set<number>());

  // Refresh invites on first render
  useEffect(() => {
    dispatch(getInvites());
    // eslint-disable-next-line
  }, []);

  const handleOnClose: ModalProps['onClose'] = useCallback((_event, reason) => {
    if (reason === 'backdropClick') {
      dispatch(closeModal());
    }
  }, []);

  const handleDelete = useCallback((groupId: number) => {
    setToDelete((prev) => new Set<number>([...prev, groupId]));
    const timeout = setTimeout(() => {
      setInvites((prev) => {
        return prev.filter((invite) => invite.groupId !== groupId);
      });
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  let content: JSX.Element;
  if (invites.length > 0) {
    content = (
      <List>
        {
          invites.map((invite, index) =>
            <Collapse
              in={!toDelete.has(invite.groupId)}
              key={`invite-container-${invite.groupId}`}
            >
              {
                index > 0 &&
                <Divider />
              }
              <InvitesListItem
                deleteSelf={() => handleDelete(invite.groupId)}
                invite={invite}
              />
            </Collapse>,
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
      onClose={handleOnClose}
    >
      <CloseableDialogTitle close={() => dispatch(closeModal())}>
        {t('modals.invites.title')}
      </CloseableDialogTitle>
      <DialogContent style={{minHeight: 100}}>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default Invites;
