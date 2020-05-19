import React from 'react';
import {Drawer as MatDrawer} from '@material-ui/core';
import {makeStyles, createStyles} from '@material-ui/styles';
import clsx from 'clsx';
import DrawerFooter from './DrawerFooter';
import DrawerHeader from './DrawerHeader';

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
    drawerPaperPermanent: {
      height: `calc(100% - ${theme.shape.headerHeight}px)`,
      marginTop: theme.shape.headerHeight,
    },
    footer: {
      bottom: 0,
      position: 'absolute',
    },
  }),
);

const Drawer: React.FC<DrawerProps> = (props: DrawerProps) => {
  const {open, onClose, permanent} = props;
  const classes = useStyles();

  return (
    <MatDrawer
      anchor='right'
      open={open || permanent}
      onClose={onClose}
      className={clsx(classes.drawer, {[classes.drawerPermanent]: permanent})}
      variant={permanent ? 'permanent': 'temporary'}
      classes={{
        paper: clsx(
            classes.drawerPaper,
            {
              [classes.drawerPaperPermanent]: permanent,
            },
        ),
      }}
    >
      <DrawerHeader close={onClose} noCloseButton={permanent}/>
      <DrawerFooter className={classes.footer}/>
    </MatDrawer>
  );
};

export default Drawer;
