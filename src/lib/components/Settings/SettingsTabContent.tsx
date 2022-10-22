import React, {FC} from 'react';
import {Box, createStyles, makeStyles} from '@material-ui/core';
import {GroupCarTheme} from '../../theme';

export interface SettingsTabContentProps {
  id?: string;
}

const useStyles = makeStyles((theme: GroupCarTheme) =>
  createStyles({
    root: {
      height: '100%',
      padding: theme.spacing(3),
      paddingTop: 0,
      overflow: 'auto',
    },
  }),
);

export const SettingsTabContent: FC<SettingsTabContentProps> = (
  props,
) => {
  const classes = useStyles();

  return (
    <Box className={classes.root} id={props.id}>
      {props.children}
    </Box>
  );
};

export default SettingsTabContent;
