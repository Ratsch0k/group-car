import {Box, useMediaQuery} from '@material-ui/core';
import {createStyles, makeStyles} from '@material-ui/styles';
import React, {useState} from 'react';
import {
  GroupCarTheme,
  Drawer,
  HeaderBar,
} from 'lib';
import Routes from 'pages';

const GroupCar: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const largerLg = useMediaQuery((theme: GroupCarTheme) =>
    theme.breakpoints.up('lg'));

  const useStyle = makeStyles((theme: GroupCarTheme) =>
    createStyles({
      body: {
        height: '100%',
        width: '100%',
        display: 'flex',
      },
      content: {
        paddingRight: largerLg ? theme.shape.drawerWidth : 0,
        width: '100%',
        flexGrow: 1,
      },
    }),
  );
  const classes = useStyle();

  return (
    <Box className={classes.body}>
      <HeaderBar
        openDrawer={() => setOpen(true)}
        noMenuButton={largerLg}
      />
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
