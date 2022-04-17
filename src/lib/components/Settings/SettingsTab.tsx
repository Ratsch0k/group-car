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
  id: string;
}

const useStyles = makeStyles((theme: GroupCarTheme) =>
  createStyles({
    root: {
      '&:hover': {
        color: theme.palette.primary.main,
        background: alpha(theme.palette.primary.main, 0.04),
        borderRight: `2px solid ${theme.palette.primary.main}`,
      },
      'transition': '250ms color',
      'borderRadius': theme.shape.borderRadius,
      'borderRight': `2px solid #FFFFFF00`,
      'borderTopRightRadius': 0,
      'borderBottomRightRadius': 0,
    },
    rootSelected: {
      color: theme.palette.secondary.dark,
      background: alpha(theme.palette.secondary.main, 0.04),
      borderRight: `2px solid ${theme.palette.secondary.main}`,
    },
  }),
);

export const SettingsTab: FC<SettingsTabProps<unknown>> = (props) => {
  const {children, icon, index, dense, open, value, id} = props;
  const classes = useStyles();

  return (
    <ListItem
      onClick={() => open(index)}
      button
      className={clsx(classes.root, {[classes.rootSelected]: value === index})}
      color='primary'
      dense={dense}
      id={id}
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
