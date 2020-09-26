import {CircularProgress, Fab, IconButton, TextField, Theme} from '@material-ui/core';
import {
  GroupWithOwnerAndMembers,
  TabPanel,
  useApi,
  useAuth,
  UserSimple,
} from 'lib';
import React, {useEffect, useState} from 'react';
import ManageGroupMemberList from './ManageGroupMemberList';
import {createStyles, makeStyles, withStyles} from '@material-ui/styles';
import {isAdmin as isAdminCheck} from '../../../util';
import clsx from 'clsx';
import ClearIcon from '@material-ui/icons/Clear';
import {CSSTransition, SwitchTransition} from 'react-transition-group';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {useTranslation} from 'react-i18next';
import SendIcon from '@material-ui/icons/Send';


export interface ManageGroupMembersTab {
  group: GroupWithOwnerAndMembers;
  className?: string;
  visible: boolean;
}

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
  }),
);

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

export const ManageGroupMembersTab: React.FC<ManageGroupMembersTab> =
(props: ManageGroupMembersTab) => {
  const classes = useStyles();
  const {user} = useAuth();
  const {searchForUser, inviteUser} = useApi();
  const [isInvitingUser, setIsInvitingUser] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(
      isAdminCheck(props.group, user?.id));
  const [userToInvite, setUserToInvite] = useState<string>('');
  const [inviting, setInviting] = useState<boolean>(false);
  const [possibleUsers, setPossibleUsers] = useState<UserSimple[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const {t} = useTranslation();
  const [state, setState] = useState<'inviting'|'opened'|'closed'>('closed');

  // Update isAdmin state if either the group or the user changes
  useEffect(() => {
    setIsAdmin(isAdminCheck(props.group, user?.id));
  }, [user, props.group]);


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

  const handleInvite = async () => {
    setInviting(true);
    try {
      await inviteUser(props.group.id, userToInvite);
      setInviting(false);
      setIsInvitingUser(false);
    } catch (e) {
      setInviting(false);
    }
  };

  return (
    <TabPanel
      className={props.className}
      visible={props.visible}
      id='group-tabpanel-members'
      aria-labelledby='group-tab-members'
    >
      <ManageGroupMemberList group={props.group}/>
      {
        true &&
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
      }
    </TabPanel>
  );
};

export default ManageGroupMembersTab;
