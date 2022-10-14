import {
  Box,
  createStyles,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import {GroupCarTheme} from 'lib/theme';
import React, {FC} from 'react';
import LoadingSkeleton from '../LoadingSkeleton';
import SettingsTabContent from './SettingsTabContent';
import SettingsTitle from './SettingsTitle';

const useStyles = makeStyles((theme: GroupCarTheme) => createStyles({
  root: {
    flex: '1 1 auto',
    background: theme.palette.background.paper,
    borderRadius: `0px ${theme.shape.borderRadiusSized.large}px ` +
      `${theme.shape.borderRadiusSized.large}px 0px`,
    [theme.breakpoints.only('sm')]: {
      borderRadius: theme.shape.borderRadiusSized.large,
    },
    outline: '2px solid ' + theme.palette.background.paper,
    display: 'flex',
    minWidth: 0,
    flexDirection: 'column',
    [theme.breakpoints.down('md')]: {
      outline: 'none',
    },
    zIndex: 1400,
  },
}));

export interface SettingsContentProps {
  showBackButton?: boolean;
  goBack: () => void;
  loading?: boolean;
  title: string;
}

export const SettingsContent: FC<SettingsContentProps> = (props) => {
  const classes = useStyles();
  const {
    showBackButton,
    goBack,
    loading,
    title,
    children,
  } = props;
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Box className={classes.root}>
      <SettingsTitle
        showBackButton={showBackButton}
        goBack={goBack}
      >
        {
          loading ?
            <LoadingTitle />:
            title
        }
      </SettingsTitle>
      <SettingsTabContent>
        {
          loading && mdUp ?
            <LoadingContent /> :
            children
        }
      </SettingsTabContent>
    </Box>
  );
};

const LoadingTitle = () => {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));
  return <LoadingSkeleton
    width={mdUp ? 300 : 200}
    animation='wave' />;
};

const LoadingContent = () => {
  return (
    <>
      <Typography variant='h5'>
        <LoadingSkeleton width={200} />
      </Typography>
      <br/>
      <Typography>
        <LoadingSkeleton width={100} />
      </Typography>
      <br/>
      <Typography>
        <Typography>
          <LoadingSkeleton variant='rect' height={200}/>
        </Typography>
        <br/>
        <Typography variant='h4'>
          <LoadingSkeleton variant='rect' />
        </Typography>
        <br/>
        <Typography variant='h4'>
          <LoadingSkeleton variant='rect' />
        </Typography>
      </Typography>
    </>
  );
};

export default SettingsContent;
