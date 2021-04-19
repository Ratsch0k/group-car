import React, {useRef, useState} from 'react';
import {
  Button,
  Popper,
  Box,
  Grow,
  ClickAwayListener,
} from '@material-ui/core';
import {useTranslation} from 'react-i18next';
import GroupOptionsMenu from './GroupOptionsMenu';
import {makeStyles, createStyles} from '@material-ui/styles';
import {GroupCarTheme} from 'lib/theme';
import {useShallowAppSelector} from 'lib/redux/hooks';
import {getSelectedGroup} from 'lib/redux/slices/group';

/**
 * Button for opening group options.
 */
export const GroupOptionsButton: React.FC = () => {
  const selectedGroup = useShallowAppSelector(getSelectedGroup);
  const {t} = useTranslation();
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const useStyles = makeStyles((theme: GroupCarTheme) =>
    createStyles({
      menuContainer: {
        width: anchorRef.current ? anchorRef.current.clientWidth : undefined,
        marginTop: theme.spacing(1),
      },
      popper: {
        zIndex: theme.zIndex.tooltip,
      },
    }),
  );
  const classes = useStyles();

  const handleClose = () => {
    if (!loading) {
      setOpen(false);
    }
  };
  const handleOpenToggle = () => {
    if (!loading) {
      setOpen((prev: boolean) => !prev);
    }
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Box>
        <Button
          fullWidth
          ref={anchorRef}
          disableElevation
          color='primary'
          variant='contained'
          onClick={handleOpenToggle}
        >
          {
            selectedGroup !== null ?
              selectedGroup.name :
              t('drawer.groupMenu.noSelection')
          }
        </Button>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          transition
          disablePortal
          placement='bottom-end'
          className={classes.popper}
        >
          {({TransitionProps}) => (
            <Grow {...TransitionProps}>
              <Box
                className={classes.menuContainer}
              >
                <GroupOptionsMenu
                  loading={loading}
                  setLoading={setLoading}
                  close={handleClose}
                />
              </Box>
            </Grow>
          )}
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

export default GroupOptionsButton;
