import {Box, useMediaQuery} from '@material-ui/core';
import {makeStyles} from '@material-ui/styles';
import React, {useState} from 'react';
import {
  GroupCarTheme,
  Drawer,
  HeaderBar,
} from 'lib';
import Map from '../Map';
import ModalRoutes from '../../modals/Routes';

const GroupCar: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const largerLg = useMediaQuery((theme: GroupCarTheme) =>
    theme.breakpoints.up('lg'));

  const useStyle = makeStyles({
    body: {
      height: '100%',
      width: '100%',
      display: 'flex',
    },
    content: {
      width: '100%',
      flexGrow: 1,
    },
  });
  const classes = useStyle();

  return (
    <>
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
          <Map />
        </Box>
      </Box>
      <ModalRoutes />
    </>
  );
};

export default GroupCar;
