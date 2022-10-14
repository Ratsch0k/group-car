import React, {useCallback, useRef, useState} from 'react';
import {
  Popper,
  Box,
  Grow,
  ClickAwayListener, Grid, Tooltip,
} from '@material-ui/core';
import {useTranslation} from 'react-i18next';
import GroupOptionsMenu from './GroupOptionsMenu';
import {makeStyles, createStyles} from '@material-ui/styles';
import {GroupCarTheme} from 'lib/theme';
import {useAppDispatch, useShallowAppSelector} from 'lib/redux/hooks';
import {getIsLoading, getSelectedGroup} from 'lib/redux/slices/group';
import {Button} from 'lib';
import EditIcon from '@material-ui/icons/Edit';
import {goToModal} from '../../../redux/slices/modalRouter/modalRouterSlice';

const useStyles = makeStyles((theme: GroupCarTheme) => createStyles({
  groupButtonContainer: {
    flex: '1 1 auto',
    minWidth: 0,
  },
  editButtonContainer: {
    flexGrow: 0,
    flexShrink: 0,
  },
  editButtonRoot: {
    minWidth: 36,
  },
  menuContainer: {
    marginTop: theme.spacing(1),
  },
  popper: {
    zIndex: theme.zIndex.tooltip,
  },
}));

/**
 * Button for opening group options.
 */
export const GroupOptionsButton: React.FC = () => {
  const selectedGroup = useShallowAppSelector(getSelectedGroup);
  const {t} = useTranslation();
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const groupIsLoading = useShallowAppSelector(getIsLoading);
  const classes = useStyles();
  const dispatch = useAppDispatch();

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

  const handleManageGroup = useCallback(() => {
    if (selectedGroup !== null) {
      dispatch(goToModal(`/group/manage/${selectedGroup.id}`));
    }
  }, [selectedGroup]);

  return (
    <Grid container spacing={1} wrap='nowrap'>
      <Grid item className={classes.groupButtonContainer}>
        <ClickAwayListener onClickAway={handleClose}>
          <Box>
            <Button
              fullWidth
              ref={anchorRef}
              disableElevation
              color='primary'
              variant='contained'
              onClick={handleOpenToggle}
              textEllipsis
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
              placement='bottom-end'
              className={classes.popper}
              disablePortal
            >
              {({TransitionProps}) => (
                <Grow {...TransitionProps}>
                  <Box
                    className={classes.menuContainer}
                    style={{
                      width: anchorRef.current ?
                        anchorRef.current.clientWidth :
                        undefined,
                    }}
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
      </Grid>
      <Grid item className={classes.editButtonContainer}>
        <Tooltip title={t('drawer.groupMenu.item.manage').toString()}>
          <span>
            <Button
              color='primary'
              classes={{
                root: classes.editButtonRoot,
              }}
              disabled={groupIsLoading || selectedGroup === null}
              onClick={handleManageGroup}
            >
              <EditIcon/>
            </Button>
          </span>
        </Tooltip>
      </Grid>
    </Grid>
  );
};

export default GroupOptionsButton;
