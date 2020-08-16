import React from 'react';
import {Typography, Grid, Box} from '@material-ui/core';
import {makeStyles, createStyles} from '@material-ui/styles';
import DoneIcon from '@material-ui/icons/Done';
import {green} from '@material-ui/core/colors';
import {GroupCarTheme} from 'lib/theme';
import {useTranslation} from 'react-i18next';

const SignUpRequest: React.FC = () => {
  const {t} = useTranslation();

  const useStyles = makeStyles((theme: GroupCarTheme) =>
    createStyles({
      'center': {
        display: 'grid',
        placeItems: 'center',
        height: '100%',
      },
      'checkMarkContainer': {
        opacity: 0,
        borderRadius: '50%',
        backgroundColor: green[500],
        height: theme.spacing(8),
        width: theme.spacing(8),
        display: 'grid',
        placeItems: 'center',
        animationName: '$fadeIn, $moveDown',
        animationDuration: '500ms',
        animationFillMode: 'forwards',
        animationDelay: '0ms, 400ms',
        animationTimingFunction: 'ease-in-out',
        animationDirection: 'normal, reverse',
      },
      'checkMark': {
        display: 'grid',
        placeItems: 'center',
        color: '#FFFFFF',
        fontSize: '3em',
      },
      'text': {
        opacity: 0,
        animationName: '$fadeIn, $moveDown',
        animationDuration: '500ms',
        animationDelay: '500ms',
        animationTimingFunction: 'ease-in-out',
        animationFillMode: 'forwards',
      },
      '@keyframes fadeIn': {
        from: {opacity: 0},
        to: {opacity: 1},
      },
      '@keyframes moveDown': {
        from: {
          transform: 'translate(0px, -2em)',
        },
        to: {
          transform: 'translate(0px, 0px)',
        },
      },
    }),
  );
  const classes = useStyles();

  return (
    <Box className={classes.center}>
      <Box className={classes.center}>
        <Grid
          container
          direction='column'
          justify='center'
          alignItems='center'
        >
          <div className={classes.checkMarkContainer}>
            <DoneIcon className={classes.checkMark}/>
          </div>
          <Typography
            className={classes.text}
          >{t('auth.isRequested')}</Typography>
        </Grid>
      </Box>
    </Box>
  );
};

export default SignUpRequest;
