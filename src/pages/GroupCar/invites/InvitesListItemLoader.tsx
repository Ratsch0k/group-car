import {
  Box,
  CircularProgress,
  createStyles,
  Fade,
  lighten,
  makeStyles,
  Theme,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import {useTranslation} from 'react-i18next';

/**
 * Props interface.
 */
export interface InvitesListItemLoaderProps {
  loading?: boolean;
  showAccepted?: boolean;
  parentHeight: number;
}

/**
 * Styles.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    'loaderContainer': {
      position: 'absolute',
      display: 'grid',
      placeItems: 'center',
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.04)',
      borderRadius: theme.shape.borderRadius,
      marginRight: `-${theme.spacing(4)}px`,
      marginLeft: `-${theme.spacing(2)}px`,
      color: theme.palette.primary.main,
      transition: '250ms background',
      zIndex: 1300,
    },
    'loaderContainerAccepted': {
      background: lighten(theme.palette.primary.dark, 0.8),
      color: theme.palette.primary.dark,
    },
    'loader': {
      display: 'grid',
      alignItems: 'center',
    },
    'loaderFill': {
      strokeDasharray: '200px 200px',
      strokeDashoffset: '200px',
      animation: '$fillCircle 1s ease both',
    },
    'loaderCheck': {
      animation: '$fillCircle 500ms ease both 500ms',
    },
    'loaderLoad': {
      strokeDasharray: '80px 200px',
      animation: '$undetermined 1.4s ease both infinite',
    },
    '@keyframes undetermined': {
      '0%': {
        strokeDashoffset: '200px',
      },
      '100%': {
        strokeDashoffset: '0px',
      },
    },
    '@keyframes fillCircle': {
      '100%': {
        strokeDashoffset: 0,
      },
    },
  }),
);

export const InvitesListItemLoader =
(props: InvitesListItemLoaderProps): JSX.Element | null => {
  const classes = useStyles();
  const {t} = useTranslation();
  const {loading, showAccepted, parentHeight} = props;
  const smallerSm = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm'));

  if (!loading && !showAccepted) {
    return null;
  }

  return (
    <Box
      className={
        clsx(
          classes.loaderContainer,
          {[classes.loaderContainerAccepted]: showAccepted},
        )
      }
      style={smallerSm ? {
        height: parentHeight - 4,
        top: 0,
      } : undefined}
    >
      {
        !showAccepted ?
          <CircularProgress />:
          <>
            <div style={{width: 40, height: 40}}>
              <svg viewBox='22 22 44 44' style={{display: 'block'}}>
                <path
                  d='m36 46 l6 6 l18 -18'
                  strokeWidth={3.6}
                  strokeLinecap='round'
                  fill='none'
                  className={showAccepted ? classes.loaderCheck : undefined}
                  strokeDasharray='50 50'
                  strokeDashoffset={50}
                  stroke='currentColor'
                />
              </svg>
            </div>
            <Fade in>
              <Typography color='inherit'>
                {t('modals.invites.accepted')}
              </Typography>
            </Fade>
          </>
      }
    </Box>
  );
};

export default InvitesListItemLoader;
