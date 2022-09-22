import {createStyles, makeStyles, Typography} from '@material-ui/core';
import {GroupCarTheme} from 'lib';
import React from 'react';

const useStyles = makeStyles((theme: GroupCarTheme) => createStyles({
  root: {
    marginBottom: theme.spacing(2),
    fontWeight: 'bold',
  },
}));

export const SettingsTabTitle: React.FC = (props) => {
  const classes = useStyles();

  return (
    <Typography variant='h5' className={classes.root}>
      <b>
        {props.children}
      </b>
    </Typography>
  );
};

export default SettingsTabTitle;
