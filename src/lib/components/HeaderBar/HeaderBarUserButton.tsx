import React, {useContext, useState, useEffect} from 'react';
import {
  ClickAwayListener,
  Box,
  IconButton,
  Popper,
  Fade,
  Paper,
} from '@material-ui/core';
import UserAvatar from '../UserAvatar';
import UserOverview from '../UserOverview/UserOverview';
import AuthContext from 'lib/context/auth/authContext';
import {useModalRouter} from 'lib/hooks';

const HeaderBarUserButton: React.FC = () => {
  const auth = useContext(AuthContext);
  const {goTo} = useModalRouter();

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
      goTo('/auth');
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
        <IconButton color='inherit' onClick={handleClick}>
          <UserAvatar
            userId={userId}
          />
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
