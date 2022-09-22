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
  dense?: boolean;
  selected?: boolean;
  open: (index: D) => void;
  id: string;
}

const useStyles = makeStyles((theme: GroupCarTheme) =>
  createStyles({
    root: {
      '&:hover': {
        color: theme.palette.primary.dark,
        background: alpha(theme.palette.primary.dark, 0.1),
      },
      'transition': '250ms all',
      'borderRadius': theme.shape.borderRadius,
    },
    rootSelected: {
      color: theme.palette.primary.dark,
      background: alpha(theme.palette.primary.main, 0.1),
    },
    itemIconRoot: {
      minWidth: 36,
    },
    itemText: {
      fontWeight: 'bold',
    },
  }),
);

export const SettingsTab: FC<SettingsTabProps<unknown>> = (props) => {
  const {children, icon, dense, open, selected, id} = props;
  const classes = useStyles();

  return (
    <ListItem
      onClick={open}
      button
      className={clsx(classes.root, {[classes.rootSelected]: selected})}
      color='primary'
      dense={dense}
      id={id}
    >
      <ListItemIcon
        style={{color: 'inherit'}}
        classes={{
          root: classes.itemIconRoot,
        }}
      >
        {icon}
      </ListItemIcon>
      <ListItemText primaryTypographyProps={{className: classes.itemText}}>
        {children}
      </ListItemText>
    </ListItem>
  );
};

export default SettingsTab;
