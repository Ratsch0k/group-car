import React, {FC} from 'react';
import {Box, createStyles, makeStyles} from '@material-ui/core';
import {GroupCarTheme} from '../../theme';

export interface SettingsTabContentProps<D> {
  index: D;
  value: D;
}

const useStyles = makeStyles((theme: GroupCarTheme) =>
  createStyles({
    root: {
      paddingBottom: theme.spacing(1),
      paddingTop: theme.spacing(1),
    },
  }),
);

export const SettingsTabContent: FC<SettingsTabContentProps<unknown>> = (
  props,
) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      {props.children}
    </Box>
  );
};

export default SettingsTabContent;
