import {Box, useMediaQuery} from '@material-ui/core';
import {createStyles, makeStyles} from '@material-ui/styles';
import HeaderBar from 'lib/components/HeaderBar/HeaderBar';
import Routes from 'lib/Routes';
import React, {useState} from 'react';
import Drawer from 'lib/components/Drawer/Drawer';

type GroupCarTheme = import('lib/theme').GroupCarTheme;

const GroupCar: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const largerLg = useMediaQuery((theme: any) => theme.breakpoints.up('lg'));

  const useStyle = makeStyles((theme: GroupCarTheme) =>
    createStyles({
      body: {
        height: '100%',
        width: '100%',
        display: 'flex',
      },
      content: {
        paddingTop: theme.shape.headerHeight,
        paddingRight: largerLg ? theme.shape.drawerWidth : 0,
        width: '100%',
        height: `calc(100% - ${theme.shape.headerHeight}px)`,
        flexGrow: 1,
      },
    }),
  );
  const classes = useStyle();

  return (
    <Box className={classes.body}>
      <HeaderBar openDrawer={() => setOpen(true)} noMenuButton={largerLg}/>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        permanent={largerLg}
      />
      <Box className={classes.content}>
        <Routes />
      </Box>
    </Box>
  );
};

export default GroupCar;
