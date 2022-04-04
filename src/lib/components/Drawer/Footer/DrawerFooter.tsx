import React from 'react';
import {Grid, Link, Container} from '@material-ui/core';
import {
  GroupCarTheme,
} from 'lib';
import {useTranslation} from 'react-i18next';
import {makeStyles, createStyles} from '@material-ui/styles';
import {useAppDispatch} from 'lib/redux/hooks';
import {goToModal} from 'lib/redux/slices/modalRouter/modalRouterSlice';


/**
 * Element.
 */
export const DrawerFooter: React.FC = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();

  /**
 * Styles
 */
  const useStyles = makeStyles((theme: GroupCarTheme) =>
    createStyles({
      paper: {
        width: '100%',
      },
      container: {
        padding: theme.spacing(1),
      },
    }),
  );
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Grid container justifyContent='space-evenly'>
        <Grid item>
          <Link component='button' onClick={
            () => dispatch(goToModal('/privacy-policy'))
          }>
            {t('privacyPolicy.title')}
          </Link>
        </Grid>
        <Grid item>
          <Link
            component='button'
            onClick={() => dispatch(goToModal('/imprint'))}
          >
            {t('imprint.title')}
          </Link>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DrawerFooter;
