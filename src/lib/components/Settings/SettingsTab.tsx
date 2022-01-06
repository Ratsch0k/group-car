import React, {FC} from 'react';
import {
  alpha,
  createStyles,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import {GroupCarTheme} from '../../theme';
import clsx from 'clsx';

export interface SettingsTabProps<D> {
  icon: React.ReactNode;
  index: D;
  dense?: boolean;
  value: D;
  open: (index: D) => void;
}

const useStyles = makeStyles((theme: GroupCarTheme) =>
  createStyles({
    root: {
      '&:hover': {
        color: theme.palette.primary.dark,
        background: alpha(theme.palette.primary.main, 0.04),
      },
      'transition': '250ms all',
      'borderRadius': theme.shape.borderRadius,
    },
    rootSelected: {
      color: theme.palette.secondary.dark,
      background: alpha(theme.palette.secondary.main, 0.04),
    },
  }),
);

export const SettingsTab: FC<SettingsTabProps<unknown>> = (props) => {
  const {children, icon, index, dense, open, value} = props;
  const classes = useStyles();

  return (
    <ListItem
      onClick={() => open(index)}
      button
      className={clsx(classes.root, {[classes.rootSelected]: value === index})}
      color='primary'
      dense={dense}
    >
      <ListItemIcon style={{color: 'inherit'}}>
        {icon}
      </ListItemIcon>
      <ListItemText>
        {children}
      </ListItemText>
    </ListItem>
  );
};

export default SettingsTab;