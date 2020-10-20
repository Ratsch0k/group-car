import React, {useState, useEffect} from 'react';
import {useAxios} from 'lib/hooks';
import {RestError} from 'lib/api';
import {
  Snackbar,
  IconButton,
  SnackbarContent,
  Typography,
  Grid,
} from '@material-ui/core';
import {AxiosError} from 'axios';
import CloseIcon from '@material-ui/icons/Close';
import {makeStyles, createStyles} from '@material-ui/styles';
import {GroupCarTheme} from 'lib/theme';
import ErrorIcon from '@material-ui/icons/ErrorOutline';

/**
 * Styles.
 */
const useStyles = makeStyles((theme: GroupCarTheme) =>
  createStyles({
    snackbar: {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText,
    },
    center: {
      display: 'grid',
      placeItems: 'center',
    },
  }),
);

/**
 * Error handling component for axios errors.
 * @param props Only children.
 */
export const AxiosErrorHandler: React.FC = () => {
  const {axios} = useAxios();
  const [message, setMessage] = useState<string | null>(null);
  const classes = useStyles();

  useEffect(() => {
    axios.then((axios) => axios.interceptors.response.use(
        (res) => res,
        (e: AxiosError<RestError>) => {
          if (e.response && !e.response.config.url?.includes('/auth/token')) {
            setMessage(e.response?.data.message);
          }

          return Promise.reject(e);
        }));
  }, [axios]);

  return (
    <Snackbar
      message={message}
      open={message !== null}
      onClose={() => setMessage(null)}
      onExited={() => setMessage(null)}
    >
      <SnackbarContent
        classes={{
          root: classes.snackbar,
        }}
        message={
          <Grid
            container
            alignItems='center'
            spacing={1}
          >
            <Grid item className={classes.center}>
              <ErrorIcon className={classes.center}/>
            </Grid>
            <Grid item className={classes.center}>
              <Typography
                variant='subtitle2'
                align='center'
              >
                {message}
              </Typography>
            </Grid>
          </Grid>
        }
        action={
          <IconButton
            onClick={() => setMessage(null)}
            color='inherit'
          >
            <CloseIcon />
          </IconButton>
        }
      />
    </Snackbar>
  );
};
