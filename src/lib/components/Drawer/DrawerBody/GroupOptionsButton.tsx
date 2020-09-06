import React, {useRef, useState} from 'react';
import {
  Button,
  Popper,
  Box,
  Grow,
  ClickAwayListener,
} from '@material-ui/core';
import useGroups from 'lib/hooks/useGroups';
import {useTranslation} from 'react-i18next';
import GroupOptionsMenu from './GroupOptionsMenu';
import {makeStyles, createStyles} from '@material-ui/styles';
import {GroupCarTheme} from 'lib/theme';

export const GroupOptionsButton: React.FC = () => {
  const {selectedGroup} = useGroups();
  const {t} = useTranslation();
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState<boolean>(false);

  const useStyles = makeStyles((theme: GroupCarTheme) =>
    createStyles({
      menuContainer: {
        width: anchorRef.current ? anchorRef.current.clientWidth : undefined,
        marginTop: theme.spacing(1),
      },
    }),
  );
  const classes = useStyles();

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box>
        <Button
          fullWidth
          ref={anchorRef}
          disableElevation
          color='primary'
          variant='contained'
          onClick={() => setOpen((prev: boolean) => !prev)}
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
        >
          {({TransitionProps}) => (
            <Grow {...TransitionProps}>
              <Box
                className={classes.menuContainer}
              >
                <GroupOptionsMenu close={() => setOpen(false)}/>
              </Box>
            </Grow>
          )}
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

export default GroupOptionsButton;
