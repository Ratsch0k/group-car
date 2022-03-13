import React, {useState, useEffect} from 'react';
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
import {createStyles, makeStyles} from '@material-ui/styles';
import clsx from 'clsx';
import {useAppDispatch, useShallowAppSelector} from 'lib/redux/hooks';
import {getUser, openAuthDialog} from 'lib/redux/slices/auth';
import {getAllInvites} from 'lib/redux/slices/invites';

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

/**
 * UserButton for the HeaderBar.
 * If the user is not logged in it opens the authentication dialog.
 * If the user is logged in it opens the UserOverview.
 */
export const HeaderBarUserButton: React.FC = () => {
  const user = useShallowAppSelector(getUser);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const smallerXs = useMediaQuery(theme.breakpoints.down('xs'));
  const classes = useStyles();
  const [userId, setUserId] = useState<number>();
  const [anchor, setAnchor] =
      useState<HTMLElement | null>(null);
  const invites = useShallowAppSelector(getAllInvites);

  /**
   * Handles a click on the button.
   * If the user is logged in the click will open
   * the UserOverview Popper, if not the
   * authentication dialog is opened.
   * @param event MouseEvent to handle
   */
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (user && user.username) {
      if (anchor) {
        setAnchor(null);
      } else {
        setAnchor(event.currentTarget);
      }
    } else {
      dispatch(openAuthDialog());
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
    if (user && user.id !== undefined) {
      setUserId(user.id);
    } else {
      setUserId(undefined);
    }
  }, [user]);

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
          <Badge
            badgeContent={invites.length}
            max={9}
            color='secondary'
            overlap='circular'
          >
            <UserAvatar
              userId={userId}
              size={smallerXs ? 'small' : 'medium'}
            />
          </Badge>
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
