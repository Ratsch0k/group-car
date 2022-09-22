import {Box, createStyles, makeStyles} from '@material-ui/core';
import {GroupCarTheme} from 'lib/theme';
import React, {FC} from 'react';

const useStyles = makeStyles((theme: GroupCarTheme) => createStyles({
  root: {
    flex: '1 1 auto',
    background: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadiusSized.large,
    outline: '2px solid ' + theme.palette.background.paper,
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('md')]: {
      outline: 'none',
    },
  },
}));

export const SettingsContent: FC = (props) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      {props.children}
    </Box>
  );
};

export default SettingsContent;
