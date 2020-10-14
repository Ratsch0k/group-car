import {
  CircularProgress,
  createStyles,
  Fab,
  IconButton,
  makeStyles,
  TextField,
  Theme,
  withStyles,
} from '@material-ui/core';
import {Autocomplete} from '@material-ui/lab';
import clsx from 'clsx';
import React, {useEffect, useState} from 'react';
import {CSSTransition, SwitchTransition} from 'react-transition-group';
import SendIcon from '@material-ui/icons/Send';
import ClearIcon from '@material-ui/icons/Clear';
import {
  GroupWithOwnerAndMembersAndInvites,
  InviteWithUserAndInviteSender,
  useApi,
  useAuth,
  UserSimple,
} from 'lib';
import {useTranslation} from 'react-i18next';

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
      'position': 'absolute',
      'bottom': theme.spacing(1),
      'right': theme.spacing(1),
      'borderRadius': 28,
      'transition': 'width 500ms, position 500ms',
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
    },
    invitingUserButton: {
      flexGrow: 0,
      flexShrink: 0,
    },
  }),
);

/**
 * Props.
 */
export interface ManageGroupMemberTabSearchUserProps {
  /**
   * Data of the group.
   */
  group: GroupWithOwnerAndMembersAndInvites;

  addInvite(invite: InviteWithUserAndInviteSender): void;
}

/**
 * Fab which transforms to a invite user bar.
 */
export const ManageGroupMemberTabSearchUser: React.FC<
  ManageGroupMemberTabSearchUserProps
> = (props: ManageGroupMemberTabSearchUserProps) => {
  const classes = useStyles();
  const {searchForUser, inviteUser} = useApi();
  const [inviting, setInviting] = useState<boolean>(false);
  const [isInvitingUser, setIsInvitingUser] = useState<boolean>(false);
  const [possibleUsers, setPossibleUsers] = useState<UserSimple[]>([]);
  const [userToInvite, setUserToInvite] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const {user} = useAuth();
  const {t} = useTranslation();

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
          setPossibleUsers(users.data.users);
        }
      }
    };

    update();

    return () => {
      isActive = false;
    };
  }, [userToInvite, searchForUser]);

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
      const inviteResponse = await inviteUser(props.group.id, userToInvite);
      setInviting(false);
      props.addInvite({
        ...inviteResponse.data,
        User: {
          username: userToInvite,
          id: inviteResponse.data.userId,
        },
        InviteSender: {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          username: user!.username,
          id: inviteResponse.data.invitedBy,
        },
      });
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
                      getOptionLabel={(user) => user.username}
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
                        />
                      )}
                    />
                  </div>
                  <div>
                    <IconButton
                      disabled={userToInvite.length <= 0}
                      color='inherit'
                      onClick={handleInvite}
                    >
                      <SendIcon />
                    </IconButton>
                  </div>
                  <div>
                    <IconButton
                      color='inherit'
                      onClick={() => isInvitingUser && setIsInvitingUser(false)}
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
