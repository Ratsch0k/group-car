import {createStyles, Grid, makeStyles, Typography} from '@material-ui/core';
import {Trans} from 'react-i18next';
import React from 'react';
import {ErrorOutline} from '@material-ui/icons';
import {GroupCarTheme} from 'lib/theme';


const useStyles = makeStyles((theme: GroupCarTheme) => createStyles({
  icon: {
    color: theme.palette.error.main,
  },
}));

export const PermissionDenied = (): JSX.Element => {
  const classes = useStyles();

  return (
    <Grid
      container
      direction='column'
      alignItems='center'
    >
      <Grid item className={classes.icon}>
        <ErrorOutline fontSize='large' />
      </Grid>
      <Grid item>
        <Typography>
          <Trans i18nKey='modals.permissionPrompt.denied'/>
        </Typography>
      </Grid>
    </Grid>
  );
};

export default PermissionDenied;
