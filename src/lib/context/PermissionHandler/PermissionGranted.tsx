import {createStyles, Grid, makeStyles, Typography} from '@material-ui/core';
import {CheckOutlined} from '@material-ui/icons';
import {GroupCarTheme} from 'lib/theme';
import React from 'react';
import {useTranslation} from 'react-i18next';

const useStyles = makeStyles((theme: GroupCarTheme) => createStyles({
  icon: {
    color: theme.palette.success.main,
  },
}));

export const PermissionGranted = (): JSX.Element => {
  const {t} = useTranslation();
  const classes = useStyles();

  return (
    <Grid
      container
      direction='column'
      alignItems='center'
    >
      <Grid item className={classes.icon}>
        <CheckOutlined fontSize='large'/>
      </Grid>
      <Grid item>
        <Typography>
          {t('modals.permissionPrompt.granted')}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default PermissionGranted;
