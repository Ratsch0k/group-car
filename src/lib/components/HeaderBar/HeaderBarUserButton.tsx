import React, {useContext, useState, useEffect} from 'react';
import {
  ClickAwayListener,
  IconButton,
  Popper,
  Fade,
  Paper,
  Badge,
  Box,
} from '@material-ui/core';
import UserAvatar from '../UserAvatar';
import UserOverview from '../UserOverview/UserOverview';
import {AuthContext, InvitesProvider, InvitesContext} from 'lib';

export const HeaderBarUserButton: React.FC = () => {
  const auth = useContext(AuthContext);
  const {openAuthDialog} = useContext(AuthContext);

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
        <InvitesProvider>
          <IconButton color='inherit' onClick={handleClick}>
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
        </InvitesProvider>
      </Box>
    </ClickAwayListener>
  );
};

export default HeaderBarUserButton;
