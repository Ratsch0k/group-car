import {
  Box,
  DialogContent,
  Divider,
  List, ModalProps,
  Theme,
  Typography,
} from '@material-ui/core';
import {createStyles, makeStyles} from '@material-ui/styles';
import {CloseableDialogTitle, Dialog} from 'lib';
import React, {useCallback, useEffect} from 'react';
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
  const invites = useShallowAppSelector(getAllInvites);
  const {t} = useTranslation();
  const classes = useStyles();
  const dispatch = useAppDispatch();

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
      onClose={handleOnClose}
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
