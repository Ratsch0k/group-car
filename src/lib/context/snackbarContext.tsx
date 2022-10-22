import {
  createStyles,
  IconButton,
  makeStyles,
  Snackbar,
  SnackbarCloseReason,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import {Alert} from '@material-ui/lab';
import {AxiosError} from 'axios';
import clsx from 'clsx';
import axios from 'lib/client';
import {GroupCarTheme} from 'lib/theme';
import coloredShadow from 'lib/util/coloredShadow';
import isRestError from 'lib/util/isRestError';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';

/**
 * Types of snackbars.
 */
export type SnackbarType = 'success' | 'warning' | 'error' | 'info';
export interface ShowOptions {
  type: SnackbarType;
  content: string | JSX.Element;
  action?: JSX.Element;
  withClose?: boolean;
}

export type Show = (
  typeOrOptions: SnackbarType | ShowOptions,
  content?: string | JSX.Element,
) => void;

export interface SnackbarContext {
  show: Show;
}

/**
 * Default SnackbarContext.
 */
export const SnackbarContext = React.createContext<SnackbarContext>({
  show: () => undefined,
});
SnackbarContext.displayName = 'SnackbarContext';

/**
 * Styles.
 */
const useStyles = makeStyles((theme: GroupCarTheme) => createStyles({
  hidden: {
    display: 'none',
  },
  alert: {
    boxShadow: coloredShadow('#000000', 2),
    borderRadius: theme.shape.borderRadiusSized.default,
  },
}));

/**
 * Provider for the SnackbarContext.
 * @param props Props
 */
export const SnackbarProvider: React.FC = (props) => {
  const [queue, setQueue] = useState<ShowOptions[]>([]);
  const [activeSnack, setActiveSnack] = useState<ShowOptions>();
  const {t} = useTranslation();
  const classes = useStyles();


  const show: Show = useCallback((
    typeOrOptions,
    content,
  ) => {
    let options: ShowOptions;

    if (typeof typeOrOptions === 'object') {
      options = typeOrOptions;
    } else {
      if (content === undefined) {
        throw new TypeError('If typeOrOptions is the type, ' +
          'the content has to be provided');
      }

      options = {
        type: typeOrOptions,
        content,
      };
    }

    setQueue((prev) => [...prev, options]);
  }, []);

  useEffect(() => {
    if (activeSnack === undefined && queue.length > 0) {
      setActiveSnack(queue[0]);
      setQueue((prev) => prev.slice(1, prev.length));
    }
  }, [queue, activeSnack]);

  const handleClose = useCallback((
    event: React.SyntheticEvent<unknown, Event>,
    reason: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    closeSnackbar();
  }, []);

  const closeSnackbar = useCallback(() => {
    setActiveSnack(undefined);
  }, []);


  useEffect(() => {
    axios.interceptors.response.use(
      (res) => res,
      (e: AxiosError) => {
        if (e.response && isRestError(e.response.data)) {
          if (
            e.response.config.url !== '/auth/token' ||
            e.response.config.method !== 'put' ||
            e.response.status !== 401
          ) {
            const {errorName, ...rest} = e.response.data.detail;
            show('error', t('errors.' + errorName, rest));
          }
        } else {
          show('error', e.message);
        }

        return Promise.reject(e);
      },
    );
    axios.interceptors.request.use(
      (res) => res,
      (e: AxiosError) => {
        if (e.response && isRestError(e.response.data)) {
          if (
            e.response.config.url !=='/auth/token' ||
            e.response.config.method !== 'put' ||
            e.response.status !== 401
          ) {
            const {errorName, ...rest} = e.response.data.detail;
            show('error', t('errors.' + errorName, rest));
          }
        } else {
          show('error', e.message);
        }

        return Promise.reject(e);
      },
    );
  }, [show]);

  return (
    <SnackbarContext.Provider value={{show}}>
      {props.children}
      <div
        className={
          clsx({[classes.hidden]: activeSnack === undefined})
        }
      >
        <Snackbar
          open={activeSnack !== undefined}
          autoHideDuration={5000}
          onClose={handleClose}
          TransitionProps={{
            onExited: closeSnackbar,
          }}
        >
          {
            activeSnack &&
              <Alert
                className={classes.alert}
                severity={activeSnack.type}
                action={
                  <React.Fragment>
                    {activeSnack.action}
                    {
                      activeSnack.withClose &&
                      <IconButton
                        onClick={closeSnackbar}
                        color='inherit'
                        size='small'
                      >
                        <CloseIcon fontSize='small'/>
                      </IconButton>
                    }
                  </React.Fragment>
                }
                closeText={t('misc.close')}
              >
                {activeSnack.content}
              </Alert>
          }
        </Snackbar>
      </div>
    </SnackbarContext.Provider>
  );
};

export default SnackbarProvider;
