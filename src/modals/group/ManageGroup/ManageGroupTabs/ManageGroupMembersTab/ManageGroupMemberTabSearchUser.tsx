import {
  CircularProgress,
  createStyles,
  Fab,
  IconButton,
  makeStyles,
  TextField,
  useMediaQuery,
  withStyles,
  useTheme,
  Theme,
} from '@material-ui/core';
import {Autocomplete} from '@material-ui/lab';
import clsx from 'clsx';
import React, {useEffect, useState} from 'react';
import {CSSTransition, SwitchTransition} from 'react-transition-group';
import SendIcon from '@material-ui/icons/Send';
import ClearIcon from '@material-ui/icons/Clear';
import {
  searchForUser,
} from 'lib';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useShallowAppSelector} from 'lib/redux/hooks';
import {getSelectedGroup, inviteUser} from 'lib/redux/slices/group';
import {unwrapResult} from '@reduxjs/toolkit';
import {UserSimple} from 'typings';
import {glowShadow} from '../../../../../lib/util/glowShadow';

/**
 * Special variant of the TextField.
 */
const InvitingUserTextField = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '& .MuiInputBase-root': {
        backgroundColor: 'white',
      },
      '& .MuiOutlinedInput-root': {
        'userSelect': 'all',
        '&.Mui-focused fieldset': {
          borderColor: theme.palette.secondary.light,
        },
      },
    },
  }),
)(TextField);

/**
 * Styling.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      'borderRadius': 28,
      'position': 'absolute',
      'bottom': theme.spacing(1),
      'right': theme.spacing(1),
      'transition': 'width 500ms, position 500ms',
      'boxShadow': glowShadow(theme.palette.secondary.main, 1),
      '&$fabDisabled': {
        boxShadow: 'none',
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
        pointerEvents: 'unset',
      },
      '&:hover': {
        '&$fabDisabled': {
          boxShadow: 'none',
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.secondary.contrastText,
          pointerEvents: 'unset',
        },
      },
    },
    fabExpanded: {
      width: `calc(100% - ${theme.spacing(2)}px)`,
    },
    fabDisabled: {
    },
    fabEnter: {
      opacity: 0,
    },
    fabExit: {
      opacity: 1,
    },
    fabEnterActive: {
      opacity: 1,
      transition: 'opacity 250ms',
    },
    fabExitActive: {
      opacity: 0,
      transition: 'opacity 250ms',
    },
    invitingUserContainer: {
      marginRight: theme.spacing(2),
      marginLeft: theme.spacing(2),
      display: 'flex',
      width: '100%',
      alignItems: 'center',
    },
    invitingUserTextField: {
      flexGrow: 1,
      flexShrink: 1,
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    invitingUserButton: {
      flexGrow: 0,
      flexShrink: 0,
    },
  }),
);

/**
 * Fab which transforms to an invite user bar.
 */
export const ManageGroupMemberTabSearchUser: React.FC = () => {
  const classes = useStyles();
  const [inviting, setInviting] = useState<boolean>(false);
  const [isInvitingUser, setIsInvitingUser] = useState<boolean>(false);
  const [possibleUsers, setPossibleUsers] = useState<UserSimple[]>([]);
  const [userToInvite, setUserToInvite] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const theme = useTheme();
  const smallerXs = useMediaQuery(theme.breakpoints.down('xs'));
  const {t} = useTranslation();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const group = useShallowAppSelector(getSelectedGroup)!;
  const dispatch = useAppDispatch();

  /**
   * Updates the list of possible users if the
   * username changes.
   */
  useEffect(() => {
    let isActive = true;

    const update = async () => {
      if (userToInvite.length > 0) {
        const users = await searchForUser(userToInvite);
        if (isActive) {
          // Filter out all members of group
          const possibleUsers = users.data.users.filter((user) =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
            group.members.concat(group.invites as any)
              .some((member) =>
                user.id !== member.User.id));
          setPossibleUsers(possibleUsers);
        }
      }
    };

    update();

    return () => {
      isActive = false;
    };
  }, [userToInvite, searchForUser, group.invites, group.members]);

  /**
   * Reset user search if user closes fab
   */
  useEffect(() => {
    if (!isInvitingUser) {
      setPossibleUsers([]);
      setUserToInvite('');
    }
  }, [isInvitingUser]);

  /**
   * Handles invite action.
   *
   * Uses the id of the group specified in props and
   * the current value of the text field to invite
   * a user.
   */
  const handleInvite = async () => {
    setInviting(true);
    try {
      unwrapResult(
        await dispatch(
          inviteUser({groupId: group.id, usernameOrId: userToInvite})));
      setInviting(false);
      setUserToInvite('');
    } catch (e) {
      setInviting(false);
    }
  };

  return (
    <Fab
      disabled={isInvitingUser}
      color='secondary'
      classes={{
        root: classes.fab,
        disabled: classes.fabDisabled,
      }}
      className={clsx({[classes.fabExpanded]: isInvitingUser})}
      onClick={() => !isInvitingUser && setIsInvitingUser(true)}
      component='div'
      id='member-fab'
    >
      <SwitchTransition>
        <CSSTransition
          timeout={250}
          key={inviting ? 'inviting' : isInvitingUser ? 'opened' : 'closed'}
          in={isInvitingUser}
          addEndListener={(node, done) =>
            node.addEventListener('transitioned', done, false)}
          classNames={{
            enter: classes.fabEnter,
            enterActive: classes.fabEnterActive,
            exit: classes.fabExit,
            exitActive: classes.fabExitActive,
          }}
        >
          {
            inviting ?
              <CircularProgress />:
              isInvitingUser ?
                <div className={classes.invitingUserContainer}>
                  <div className={classes.invitingUserTextField}>
                    <Autocomplete
                      open={userToInvite.length > 0 && open}
                      onOpen={() => setOpen(true)}
                      onClose={() => setOpen(false)}
                      options={possibleUsers}
                      getOptionLabel={(user) => user.username || ''}
                      getOptionSelected={(option, value) =>
                        option.username === value.username}
                      loadingText={t('misc.loading')}
                      clearText={t('misc.clear')}
                      freeSolo={true}
                      openOnFocus
                      inputValue={userToInvite}
                      onInputChange={(event, value) => {
                        setUserToInvite(value);
                      }}
                      renderInput={(params) => (
                        <InvitingUserTextField
                          {...params}
                          onChange={
                            (event: React.ChangeEvent<HTMLInputElement>) =>
                              setUserToInvite(event.currentTarget.value)
                          }
                          fullWidth
                          id='user-invite-input'
                          variant='outlined'
                          size='small'
                          autoFocus
                        />
                      )}
                    />
                  </div>
                  <div>
                    <IconButton
                      disabled={userToInvite.length <= 0}
                      color='inherit'
                      onClick={handleInvite}
                      size={smallerXs ? 'small' : 'medium'}
                    >
                      <SendIcon />
                    </IconButton>
                  </div>
                  <div>
                    <IconButton
                      color='inherit'
                      onClick={() => isInvitingUser && setIsInvitingUser(false)}
                      size={smallerXs ? 'small' : 'medium'}
                    >
                      <ClearIcon />
                    </IconButton>
                  </div>
                </div>:
                <SendIcon />
          }
        </CSSTransition>
      </SwitchTransition>
    </Fab>
  );
};

export default ManageGroupMemberTabSearchUser;
