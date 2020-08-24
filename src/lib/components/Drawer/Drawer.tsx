import React, {useContext} from 'react';
import {Drawer as MatDrawer, Container, Box} from '@material-ui/core';
import {makeStyles, createStyles} from '@material-ui/styles';
import clsx from 'clsx';
import {GroupCarTheme} from 'lib';
import DrawerHeader from './DrawerHeader';
import DrawerFooter from './Footer';
import DrawerBody from './DrawerBody';
import {AuthContext} from 'lib/context';
import DrawerNotLoggedIn from './DrawerNotLoggedIn';

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
    body: {
      paddingTop: theme.spacing(2),
    },
  }),
);

export const Drawer: React.FC<DrawerProps> = (props: DrawerProps) => {
  const {open, onClose, permanent} = props;
  const classes = useStyles();
  const {isLoggedIn} = useContext(AuthContext);

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
      {
        isLoggedIn ?
        <Box>
          {
            !permanent &&
            <DrawerHeader close={onClose} noCloseButton={permanent}/>
          }
          <Container className={classes.body}>
            <DrawerBody />
          </Container>
          <DrawerFooter className={classes.footer}/>
        </Box> :
        <DrawerNotLoggedIn />
      }
    </MatDrawer>
  );
};

export default Drawer;
