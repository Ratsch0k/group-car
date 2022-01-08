import React, {FC, useCallback} from 'react';
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
  DialogContent, Divider, Grid, Hidden, IconButton, makeStyles,
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
import {Route, Switch, useRouteMatch} from 'react-router-dom';
import AppSettingsTabAccount from './AppSettingsTabAccount';

const useStyles = makeStyles((theme: GroupCarTheme) => createStyles({
  titleIcon: {
    marginLeft: -12,
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
  const open = useCallback((path: string) => {
    dispatch(goToModal(path));
  }, [dispatch]);

  const back = useCallback(() => {
    dispatch(goToModal('/settings'));
  }, [dispatch]);

  const tabs = (
    <SettingsTabs>
      <SettingsTab
        icon={<AccountCircleIcon />}
        index={'/settings/account'}
        value={path}
        open={open as (arg0: unknown) => void}
      >
        {t('settings.account.title')}
      </SettingsTab>
      <SettingsTab
        icon={<Build />}
        index={'/settings/system'}
        value={path}
        open={open as (arg0: unknown) => void}
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
          value={path}
        />
      </Route>
      <Route path={`${path}/system`}>
        <AppSettingsTabSystem
          index={`${path}/system`}
          value={path}
        />
      </Route>
      <Hidden mdUp>
        <Route path='/settings'>
          {tabs}
        </Route>
      </Hidden>
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
              disabled={path === '/settings'}
              className={classes.titleIcon}
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
                path
                  .replace(/\/settings/, '')
                  .replace('/', '.') + '.'
              }title`)
            }
          </Hidden>
        </CloseableDialogTitle>
        <DialogContent className={classes.fullHeight}>
          <Grid
            container
            justify='flex-start'
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
