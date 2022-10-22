import React from 'react';
import {Drawer as MatDrawer, Container, Box, alpha} from '@material-ui/core';
import {makeStyles, createStyles} from '@material-ui/styles';
import clsx from 'clsx';
import {GroupCarTheme} from 'lib';
import DrawerHeader from './DrawerHeader';
import DrawerFooter from './Footer';
import DrawerBody from './DrawerBody';
import DrawerNotLoggedIn from './DrawerNotLoggedIn';
import {useAppSelector} from 'lib/redux/hooks';
import {getIsLoggedIn} from 'lib/redux/slices/auth';
import {isFirefox} from 'react-device-detect';

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
    drawerPaperPermanent: {
      zIndex: theme.zIndex.appBar,
      border: 'none',
    },
    blurred: {
      backgroundColor: alpha(theme.palette.background.paper, 0.7),
      backdropFilter: theme.palette.blur,
    },
    plain: {
      backgroundColor: theme.palette.background.paper,
    },
    footer: {
      flex: '0 0 auto',
    },
    body: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      flex: '1 1 100%',
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    header: {
      flex: '0 0 auto',
      ...theme.mixins.toolbar,
    },
  }),
);

export const Drawer: React.FC<DrawerProps> = (props: DrawerProps) => {
  const {open, onClose, permanent} = props;
  const classes = useStyles();
  const isLoggedIn = useAppSelector(getIsLoggedIn);

  return (
    <MatDrawer
      anchor='right'
      open={open || permanent}
      onClose={onClose}
      className={clsx(classes.drawer)}
      variant={permanent ? 'permanent': 'temporary'}
      ModalProps={{
        keepMounted: true,
      }}
      classes={{
        paper: clsx(
          classes.drawerPaper,
          {
            [classes.drawerPaperPermanent]: permanent,
            [classes.blurred]: permanent && !isFirefox,
            [classes.plain]: permanent && isFirefox,
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
          <DrawerFooter />
        </Box>
      </Box>
    </MatDrawer>
  );
};

export default Drawer;
