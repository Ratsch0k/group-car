import React, {useContext, useState, useEffect} from 'react';
import {
  ClickAwayListener,
  IconButton,
  Popper,
  Fade,
  Paper,
  Badge,
  Box,
  useTheme,
  useMediaQuery,
  Theme,
} from '@material-ui/core';
import UserAvatar from '../UserAvatar';
import UserOverview from '../UserOverview/UserOverview';
import {AuthContext, InvitesContext} from 'lib';
import {createStyles, makeStyles} from '@material-ui/styles';
import clsx from 'clsx';

/**
 * Styles.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    smallIconButton: {
      padding: theme.spacing(1),
    },
  }),
);

export const HeaderBarUserButton: React.FC = () => {
  const auth = useContext(AuthContext);
  const {openAuthDialog} = useContext(AuthContext);
  const theme = useTheme();
  const smallerXs = useMediaQuery(theme.breakpoints.down('xs'));
  const classes = useStyles();
  const [userId, setUserId] = useState<number>();
  const [anchor, setAnchor] =
      useState<HTMLElement | null>(null);

  /**
   * Handles a click on the button.
   * If the user is logged in the click will open
   * the UserOverview Popper, if not the
   * authentication dialog is opened.
   * @param event MouseEvent to handle
   */
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (auth.user && auth.user.username) {
      if (anchor) {
        setAnchor(null);
      } else {
        setAnchor(event.currentTarget);
      }
    } else {
      openAuthDialog();
    }
  };

  /**
   * Handles the close of the popper.
   */
  const handleClose = () => {
    setAnchor(null);
  };

  // Update the user id if it changes.
  useEffect(() => {
    if (auth.user && auth.user.id !== undefined) {
      setUserId(auth.user.id);
    } else {
      setUserId(undefined);
    }
  }, [auth.user]);

  return (
    <ClickAwayListener
      onClickAway={handleClose}
    >
      <Box>
        <IconButton
          color='inherit'
          onClick={handleClick}
          className={clsx({[classes.smallIconButton]: smallerXs})}
        >
          <InvitesContext.Consumer>
            {
              ({invites}) =>
                <Badge
                  badgeContent={invites.length}
                  max={9}
                  color='secondary'
                  overlap='circle'
                >
                  <UserAvatar
                    userId={userId}
                    size={smallerXs ? 'small' : 'medium'}
                  />
                </Badge>
            }

          </InvitesContext.Consumer>
        </IconButton>

        <Popper
          open={Boolean(anchor)}
          anchorEl={anchor}
          placement='bottom'
          disablePortal={true}
          transition
        >
          {({TransitionProps}) => (
            <Fade {...TransitionProps} timeout={200}>
              <Paper
                elevation={6}
              >
                <UserOverview
                  onClose={handleClose}
                />
              </Paper>
            </Fade>
          )}
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

export default HeaderBarUserButton;
