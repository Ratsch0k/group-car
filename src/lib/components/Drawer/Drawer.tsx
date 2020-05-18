import React from 'react';
import {Drawer as MatDrawer} from '@material-ui/core';
import {NavLink} from 'react-router-dom';
import {makeStyles, createStyles} from '@material-ui/styles';
import clsx from 'clsx';

type GroupCarTheme = import('lib/theme').GroupCarTheme;

interface DrawerProps {
  open: boolean;
  onClose(): void;
  permanent: boolean;
}

const useStyles = makeStyles((theme: GroupCarTheme) =>
  createStyles({
    drawer: {
      flexShrink: 0,
    },
    drawerPaper: {
      width: theme.shape.drawerWidth,
    },
    drawerPermanent: {
      zIndex: theme.zIndex.appBar - 1,
    },
  }),
);

const Drawer: React.FC<DrawerProps> = (props: DrawerProps) => {
  const {open, onClose, permanent} = props;
  const classes = useStyles();

  return (
    <MatDrawer
      anchor='right'
      open={open}
      onClose={onClose}
      className={clsx(classes.drawer, {[classes.drawerPermanent]: permanent})}
      variant={permanent ? 'permanent': 'temporary'}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <NavLink to='/?modal=/policy' style={{position: 'absolute', top: 100}}>
              Datenschutzerklärung
      </NavLink>
      <br />
      <NavLink to='/?modal=/imprint' style={{position: 'absolute', top: 100}}>
              Impressum
      </NavLink>
    </MatDrawer>
  );
};

export default Drawer;
