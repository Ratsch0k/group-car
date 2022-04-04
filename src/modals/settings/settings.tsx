import React, {FC, useCallback, useEffect, useState} from 'react';
import {
  AutoFullscreenDialog,
  CloseableDialogTitle,
  GroupCarTheme,
} from '../../lib';
import {useDispatch} from 'react-redux';
import {
  closeModal,
  goToModal,
} from '../../lib/redux/slices/modalRouter/modalRouterSlice';
import {useTranslation} from 'react-i18next';
import {
  createStyles,
  DialogContent,
  Divider,
  Grid,
  Hidden,
  IconButton,
  makeStyles,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import {
  SettingsTabs,
  SettingsContext,
  SettingsTab,
} from '../../lib/components/Settings';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Build from '@material-ui/icons/Build';
import AppSettingsTabSystem from './AppSettingsTabSystem';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import {Route, Switch, useLocation, useRouteMatch} from 'react-router-dom';
import AppSettingsTabAccount from './AppSettingsTabAccount';
import {goBack} from 'connected-react-router';
import clsx from 'clsx';

const useStyles = makeStyles((theme: GroupCarTheme) => createStyles({
  titleIcon: {
    marginLeft: -12,
  },
  hidden: {
    opacity: 0,
  },
  bigSide: {
    flexGrow: 0,
  },
  bigSideBorder: {
    borderRight: `${theme.palette.grey.A100} 1px solid`,
    height: '100%',
  },
  bigSideBorderRoot: {
    margin: theme.spacing(2),
    marginLeft: -1,
  },
  contents: {
    width: '100%',
    overflowY: 'auto',
  },
  fullHeight: {
    height: '100%',
  },
}));

export const AppSettings: FC = () => {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const classes = useStyles();
  const {path} = useRouteMatch();
  const [hasNavigated, setHasNavigated] = useState<boolean>(false);
  const {pathname} = useLocation();
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    if (mdUp && pathname === '/settings') {
      dispatch(goToModal('/settings/account', true));
    }
  }, [mdUp, pathname]);

  const open = useCallback((path: string) => {
    setHasNavigated(true);
    dispatch(goToModal(path));
  }, [dispatch]);

  const back = useCallback(() => {
    if (hasNavigated) {
      dispatch(goBack());
    } else {
      dispatch(goToModal('/settings', true));
    }
  }, [dispatch, hasNavigated]);

  const tabs = (
    <SettingsTabs>
      <SettingsTab
        icon={<AccountCircleIcon />}
        index={'/settings/account'}
        value={pathname}
        open={open as (arg0: unknown) => void}
        id='settings-account-tab'
      >
        {t('settings.account.title')}
      </SettingsTab>
      <SettingsTab
        icon={<Build />}
        index={'/settings/system'}
        value={pathname}
        open={open as (arg0: unknown) => void}
        id='settings-system-tab'
      >
        {t('settings.system.title')}
      </SettingsTab>
    </SettingsTabs>
  );

  const contents = (
    <Switch>
      <Route path={`${path}/account`}>
        <AppSettingsTabAccount
          index={`${path}/account`}
          value={pathname}
        />
      </Route>
      <Route path={`${path}/system`}>
        <AppSettingsTabSystem
          index={`${path}/system`}
          value={pathname}
        />
      </Route>
      {
        !mdUp &&
          <Route path='/settings'>
            {tabs}
          </Route>
      }
    </Switch>
  );

  return (
    <AutoFullscreenDialog
      open={true}
      fullWidth
      maxWidth='md'
      breakpoint='sm'
      classes={{
        paper: classes.fullHeight,
      }}
    >
      <SettingsContext.Provider value={{
        value: path,
        open,
        back,
      }}>
        <CloseableDialogTitle close={() => dispatch(closeModal())}>
          <Hidden mdUp>
            <IconButton
              onClick={() => back()}
              disabled={pathname === '/settings'}
              className={
                clsx(
                  classes.titleIcon,
                  {[classes.hidden]: pathname === '/settings'},
                )
              }
              id='settings-back-button'
            >
              <ArrowBack />
            </IconButton>
          </Hidden>
          <Hidden smDown>
            {t('settings.title')}
          </Hidden>
          <Hidden mdUp>
            {
              t(`settings${
                pathname
                  .replace(/\/settings/, '')
                  .replace('/', '.') + '.'
              }title`)
            }
          </Hidden>
        </CloseableDialogTitle>
        <DialogContent className={classes.fullHeight}>
          <Grid
            container
            justifyContent='flex-start'
            wrap='nowrap'
            className={classes.fullHeight}
          >
            <Hidden smDown>
              <Grid item className={classes.bigSide}>
                {tabs}
              </Grid>
              <Grid item className={classes.bigSideBorderRoot}>
                <Divider orientation='vertical'/>
              </Grid>
            </Hidden>
            <Grid item className={classes.contents}>
              {contents}
            </Grid>
          </Grid>
        </DialogContent>
      </SettingsContext.Provider>
    </AutoFullscreenDialog>
  );
};

export default AppSettings;
