import {
  alpha,
  Box,
  createStyles,
  Hidden,
  makeStyles,
  useMediaQuery,
} from '@material-ui/core';
import clsx from 'clsx';
import {useAppDispatch, useShallowAppSelector} from 'lib/redux/hooks';
import {
  getModalLocation,
  goToModal,
} from 'lib/redux/slices/modalRouter/modalRouterSlice';
import {GroupCarTheme, theme} from 'lib/theme';
import React, {useCallback, useEffect, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {Route, Switch, useLocation, useRouteMatch} from 'react-router-dom';
import {AutoFullscreenDialog} from '../AutoFullscreenDialog';
import SettingsContent from './SettingsContent';
import SettingsTab from './SettingsTab';
import SettingsTabs from './SettingsTabs';

/**
 * Styles
 */
const useStyles = makeStyles((theme: GroupCarTheme) => createStyles({
  container: {
    background: alpha(theme.palette.background.paper, 0.7),
    backdropFilter: theme.palette.blur,
    display: 'flex',
    flexDirection: 'row',
    border: '2px solid ' + theme.palette.background.paper,
    borderRadius: theme.shape.borderRadiusSized.large,
    overflow: 'hidden',
  },
  root: {
    background: 'none',
    [theme.breakpoints.down('xs')]: {
      background: theme.palette.background.paper,
    },
    overflow: 'hidden',
  },
  fullHeight: {
    height: '100%',
  },
  noBorder: {
    border: 'none',
  },
}));

/**
 * Data of one tab.
 */
export interface SettingsTab {
  title: string;
  icon: JSX.Element;
  page: JSX.Element;
  /**
   * Path used as a sub url.
   */
  path: string;
}

/**
 * Settings props.
 */
export interface SettingsProps {
  title: string;

  /**
   * List of tabs. Each tab is a separate settings page.
   */
  tabs: SettingsTab[];

  /**
   * If true, the settings page is shown in a loading state.
   * No actual tab is rendered.
   */
  loading?: boolean;

  /**
   * Error component. If provided, only this component will be rendered.
   * Tabs will not be displayed.
   */
  error?: JSX.Element | string;
}

/**
 * Settings dialog.
 *
 * For each tab provided in the props, a button is shown. When the user
 * clicks on it the corresponding settings page is opened.
 * On a larger screen the tabs are shown on the side and the first tab is
 * rendered.
 * @param props Props
 * @returns Settings
 */
export const Settings = (props: SettingsProps): JSX.Element => {
  const classes = useStyles();
  const {tabs, title, loading, error} = props;
  const {url} = useRouteMatch();
  const {pathname} = useLocation();
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));
  const dispatch = useAppDispatch();
  const {t} = useTranslation();
  const modalLocation = useShallowAppSelector(getModalLocation);

  /**
   * Opens the tab at the given index.
   */
  const handleOpen = useCallback((index) => {
    dispatch(goToModal(`${url}/${tabs[index].path}`));
  }, [tabs, url]);

  /**
   * Goes back to the tab overview.
   */
  const handleGoBack = useCallback(() => {
    dispatch(goToModal(url));
  }, [url]);

  /**
   * On a larger screen this trigger will automatically
   * navigate to the first tab.
   */
  useEffect(() => {
    if (mdUp && url == pathname && tabs.length > 1) {
      dispatch(goToModal(`${url}/${tabs[0].path}`, true));
    }
  }, [mdUp]);

  /**
   * Memoized list of all tab buttons.
   */
  const settingsTabs = useMemo(() => tabs.map((tab, index) => (
    <SettingsTab
      icon={tab.icon}
      id={`${title}-${tab.title}`}
      key={`${title}-${tab.title}`}
      open={() => handleOpen(index)}
      selected={pathname.startsWith(`${url}/${tab.path}`)}
    >
      {tab.title}
    </SettingsTab>
  )), [tabs]);

  /**
   * Memoized list of all pages.
   */
  const settingsPages = useMemo(() => {
    const pages = tabs.map((tab) => (
      <Route path={`${url}/${tab.path}`} key={`${url}/${tab.path}`}>
        {tab.page}
      </Route>
    ));

    if (!mdUp) {
      pages.push(
        <Route path={url} exact>
          <SettingsTabs loading={loading} error={Boolean(error)}>
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
          <SettingsTabs loading={loading} error={Boolean(error)}>
            {settingsTabs}
          </SettingsTabs>
        </Hidden>
        <SettingsContent
          showBackButton={pathname !== url}
          goBack={handleGoBack}
          loading={loading}
          title={error ? t('settings.error.title') : title}
        >
          {
            error ?
              error :
              <Switch location={modalLocation}>
                {settingsPages}
              </Switch>
          }
        </SettingsContent>
      </Box>
    </AutoFullscreenDialog>
  );
};

export default Settings;
