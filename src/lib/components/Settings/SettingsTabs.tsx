import React, {FC} from 'react';
import {Box, createStyles, List, makeStyles} from '@material-ui/core';
import {GroupCarTheme} from 'lib/theme';

const useStyles = makeStyles((theme: GroupCarTheme) => createStyles({
  root: {
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(1),
    minWidth: 200,
  },
  list: {
    '&> *': {
      marginTop: theme.spacing(1),
    },
  },
}));

export const SettingsTabs: FC = (props) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <List
        disablePadding
        className={classes.list}
      >
        {props.children}
      </List>
    </Box>
  );
};

export default SettingsTabs;
