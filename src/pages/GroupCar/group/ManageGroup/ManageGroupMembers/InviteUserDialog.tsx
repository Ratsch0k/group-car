import {
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  makeStyles,
  TextField,
} from '@material-ui/core';
import {Autocomplete} from '@material-ui/lab';
import {unwrapResult} from '@reduxjs/toolkit';
import {
  Button,
  Chip,
  Dialog,
  ProgressButton,
  searchForUser,
} from 'lib';
import {useShallowAppSelector, useAppDispatch} from 'lib/redux/hooks';
import {getSelectedGroup} from 'lib/redux/slices/group';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {inviteUser} from 'lib/redux/slices/group/groupThunks';
import isRestError from 'lib/util/isRestError';

export interface InviteUserDialogProps extends DialogProps {
  close(): void;
}

const useStyles = makeStyles({
  loaderWrapper: {
    margin: 'auto',
    width: 'fit-content',
  },
});

export const InviteUserDialog = (props: InviteUserDialogProps): JSX.Element => {
  const {t} = useTranslation();
  const {
    close,
    ...rest
  } = props;
  const classes = useStyles();
  const [inviting, setInviting] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [possibleUsers, setPossibleUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUsers] = useState<string[]>([]);
  const [userQuery, setUserQuery] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const group = useShallowAppSelector(getSelectedGroup)!;
  const dispatch = useAppDispatch();
  const [loadingError, setLoadingError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Updates the list of possible users if the
   * username changes.
   */
  useEffect(() => {
    let isActive = true;

    const update = async () => {
      setLoading(true);
      if (userQuery !== null && userQuery.length > 0) {
        try {
          const users = await searchForUser(userQuery);
          if (isActive) {
            // Filter out all members of group
            const possibleUsers = users.data.users.filter((user) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
              group.members.concat(group.invites as any)
                .every((member) =>
                  user.id !== member.User.id));
            setPossibleUsers(possibleUsers.map((u) => u.username));
            setLoadingError(false);
          }
        } catch (e) {
          setPossibleUsers([]);
          setLoadingError(true);
        }
      }
      setLoading(false);
    };

    update();

    return () => {
      isActive = false;
    };
  }, [userQuery, searchForUser, group.invites, group.members]);


  /**
   * Handles invite action.
   *
   * Uses the id of the group specified in props and
   * the current value of the text field to invite
   * a user.
   */
  const handleInvite = useCallback(async (event: React.BaseSyntheticEvent) => {
    event.preventDefault();

    setInviting(true);
    try {
      for (const user of selectedUser) {
        unwrapResult(
          await dispatch(
            inviteUser({groupId: group.id, usernameOrId: user})));
      }
      setInviting(false);
      handleClose();
    } catch (e) {
      setInviting(false);
      if (isRestError(e)) {
        const errorName = e.detail.errorName;
        switch (errorName) {
          case 'UserNotFoundError':
          case 'AlreadyInvitedError': {
            setError(errorName);
            break;
          }
        }
      }
    }
  }, [selectedUser, group]);

  console.log(loadingError);

  const handleClose = useCallback(() => {
    setSelectedUsers([]);
    setInviting(false);
    setLoadingError(false);
    setUserQuery(null);
    setError(null);
    close();
  }, []);

  return (
    <Dialog onClose={handleClose} {...rest} maxWidth='xs' fullWidth>
      <DialogTitle>
        {t('modals.group.manage.tabs.members.invite')}
      </DialogTitle>
      <form onSubmit={handleInvite}>
        <DialogContent>
          <Autocomplete
            autoComplete
            limitTags={8}
            open={userQuery !== null && userQuery.length > 0 && open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            loading={loading}
            options={possibleUsers}
            filterOptions={(options) => {
              if (loadingError) {
                return [t('modals.group.manage.tabs.members.inviteError')];
              }

              return options;
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  key={`user-${option}`}
                  color='primary'
                  label={option}
                  {...getTagProps({index})}
                />
              ))
            }
            loadingText={
              <div className={classes.loaderWrapper}>
                <CircularProgress size={30}/>
              </div>
            }
            clearText={t('misc.clear')}
            openOnFocus
            multiple
            autoHighlight
            onInputChange={(event, value, reason) => {
              if (reason === 'input') {
                setUserQuery(value);
              }
            }}
            getOptionDisabled={() => loadingError}
            onChange={(event, value, reason) => {
              switch (reason) {
                case 'select-option': {
                  if (!loadingError) {
                    setSelectedUsers(value);
                  }
                  break;
                }
                case 'remove-option': {
                  setSelectedUsers((prev) =>
                    prev.filter((value) => value !== value));
                  break;
                }
                case 'clear': {
                  setSelectedUsers([]);
                  setUserQuery(null);
                }
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                id='user-invite-input'
                variant='outlined'
                size='small'
                autoFocus
                error={Boolean(error)}
                helperText={
                  error ?
                    t('errors.' + error) :
                    ' '
                }
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            {t('misc.cancel')}
          </Button>
          <ProgressButton
            color='primary'
            variant='contained'
            type='submit'
            disabled={selectedUser.length === 0}
            loading={inviting}
          >
            {t('misc.invite')}
          </ProgressButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default InviteUserDialog;
