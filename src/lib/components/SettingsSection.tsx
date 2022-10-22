import React from 'react';
import {Box, Divider, Grid, Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/styles';
import {GroupCarTheme} from '../theme';

export interface SettingsSectionProps {
  title: string | React.ReactNode;
}

const useStyles = makeStyles((theme: GroupCarTheme) => ({
  root: {
    paddingBottom: theme.spacing(2),
  },
  title: {
    color: theme.palette.text.secondary,
  },
  header: {
    marginBottom: theme.spacing(0),
    marginTop: theme.spacing(1),
  },
  line: {
    flexGrow: 1,
    flexShrink: 1,
    paddingLeft: theme.spacing(1),
  },
  divider: {
    backgroundColor: theme.palette.text.secondary,
  },
}));

export const SettingsSection: React.FC<SettingsSectionProps> = (props) => {
  const {children, title} = props;
  const classes = useStyles();

  return (
    <>
      <Box className={classes.root}>
        <Grid container alignItems='center' className={classes.header}>
          <Grid item>
            <Typography className={classes.title} variant='body1'>
              <b>{title}</b>
            </Typography>
          </Grid>
          <Grid item className={classes.line}>
            <Divider className={classes.divider} />
          </Grid>
        </Grid>
        {children}
      </Box>
    </>
  );
};

export default SettingsSection;
