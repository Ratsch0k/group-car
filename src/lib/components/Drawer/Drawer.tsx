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
      maxWidth: theme.shape.drawerWidth,
      width: '100%',
    },
    drawerPermanent: {
      zIndex: theme.zIndex.appBar - 1,
    },
    drawerPaperPermanent: {
      height: `calc(100% - ${theme.shape.headerHeight}px)`,
      marginTop: theme.shape.headerHeight,
    },
    footer: {
      flex: '0 0 auto',
    },
    body: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      flex: '1 1 100%',
      overflow: 'hidden',
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    header: {
      flex: '0 0 auto',
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
      ModalProps={{
        keepMounted: true,
      }}
      classes={{
        paper: clsx(
          classes.drawerPaper,
          {
            [classes.drawerPaperPermanent]: permanent,
          },
        ),
      }}
    >
      <Box className={classes.container}>
        {
          !permanent &&
            <Box className={classes.header}>
              <DrawerHeader close={onClose} noCloseButton={permanent}/>
            </Box>
        }
        {
          isLoggedIn ?
            <Container className={classes.body}>
              <DrawerBody />
            </Container> :
            <DrawerNotLoggedIn />
        }
        <Box className={classes.footer}>
          <DrawerFooter className={classes.footer}/>
        </Box>
      </Box>
    </MatDrawer>
  );
};

export default Drawer;
