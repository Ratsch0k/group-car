import {
  alpha,
  Box,
  createStyles,
  Hidden,
  makeStyles,
  useMediaQuery,
} from '@material-ui/core';
import clsx from 'clsx';
import {useAppDispatch} from 'lib/redux/hooks';
import {goToModal} from 'lib/redux/slices/modalRouter/modalRouterSlice';
import {GroupCarTheme, theme} from 'lib/theme';
import React, {useCallback, useEffect, useMemo} from 'react';
import {Route, useLocation, useRouteMatch} from 'react-router-dom';
import {AutoFullscreenDialog} from '../AutoFullscreenDialog';
import SettingsContent from './SettingsContent';
import SettingsTab from './SettingsTab';
import SettingsTabContent from './SettingsTabContent';
import SettingsTabs from './SettingsTabs';
import SettingsTabTitle from './SettingsTabTitle';
import SettingsTitle from './SettingsTitle';

const useStyles = makeStyles((theme: GroupCarTheme) => createStyles({
  container: {
    background: alpha(theme.palette.background.paper, 0.7),
    backdropFilter: theme.palette.blur,
    display: 'flex',
    flexDirection: 'row',
    border: '2px solid ' + theme.palette.background.paper,
    borderRadius: theme.shape.borderRadiusSized.large,
  },
  root: {
    background: 'none',
    borderRadius: 0,
    overflow: 'hidden',
  },
  fullHeight: {
    height: '100%',
  },
  noBorder: {
    border: 'none',
  },
}));

interface SettingsTab {
  title: string;
  icon: JSX.Element;
  page: JSX.Element;
  path: string;
}

export interface SettingsProps {
  title: string;
  tabs: SettingsTab[];
}

export const Settings = (props: SettingsProps): JSX.Element => {
  const classes = useStyles();
  const {tabs, title} = props;
  const {path} = useRouteMatch();
  const {pathname} = useLocation();
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));
  const dispatch = useAppDispatch();

  const handleOpen = useCallback((index) => {
    dispatch(goToModal(`${path}/${tabs[index].path}`));
  }, []);

  const handleGoBack = useCallback(() => {
    dispatch(goToModal(path));
  }, []);

  useEffect(() => {
    if (mdUp && path == pathname) {
      dispatch(goToModal(`${path}/${tabs[0].path}`, true));
    }
  }, [mdUp]);

  const settingsTabs = useMemo(() => tabs.map((tab, index) => (
    <SettingsTab
      icon={tab.icon}
      id={`${title}-${tab.title}`}
      key={`${title}-${tab.title}`}
      open={() => handleOpen(index)}
      selected={pathname.startsWith(`${path}/${tab.path}`)}
    >
      {tab.title}
    </SettingsTab>
  )), [tabs]);

  const settingsPages = useMemo(() => {
    const pages = tabs.map((tab) => (
      <Route path={`${path}/${tab.path}`} key={`${path}/${tab.path}`}>
        <SettingsTabContent index={`${path}/${tab.path}`} value={pathname}>
          <SettingsTabTitle>
            {tab.title}
          </SettingsTabTitle>
          {tab.page}
        </SettingsTabContent>
      </Route>
    ));

    if (!mdUp) {
      pages.push(
        <Route path={path} exact>
          <SettingsTabs>
            {settingsTabs}
          </SettingsTabs>
        </Route>,
      );
    }

    return pages;
  }, [tabs, mdUp]);

  return (
    <AutoFullscreenDialog
      open={true}
      maxWidth='md'
      fullWidth
      breakpoint='sm'
      style={{overflow: 'hidden'}}
      PaperProps={{
        classes: {
          root: clsx(
            classes.root,
            classes.fullHeight,
          ),
        },
      }}
    >
      <Box
        className={clsx(
          classes.container,
          classes.fullHeight,
          {[classes.noBorder]: !mdUp},
        )}
      >
        <Hidden smDown>
          <SettingsTabs>
            {settingsTabs}
          </SettingsTabs>
        </Hidden>
        <SettingsContent>
          <SettingsTitle
            showBackButton={pathname !== path}
            goBack={handleGoBack}
          >
            {title}
          </SettingsTitle>
          {settingsPages}
        </SettingsContent>
      </Box>
    </AutoFullscreenDialog>
  );
};

export default Settings;
