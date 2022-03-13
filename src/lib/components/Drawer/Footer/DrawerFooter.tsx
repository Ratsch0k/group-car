import React from 'react';
import {Grid, Link, Container} from '@material-ui/core';
import {
  DrawerCard,
  GroupCarTheme,
} from 'lib';
import {useTranslation} from 'react-i18next';
import {makeStyles, createStyles} from '@material-ui/styles';
import clsx from 'clsx';
import {useAppDispatch} from 'lib/redux/hooks';
import {goToModal} from 'lib/redux/slices/modalRouter/modalRouterSlice';


type GridProps = import('@material-ui/core').GridProps;

/**
 * Props.
 */
interface DrawerFooterProps extends GridProps {
  justify?: undefined;
  className?: string;
}

/**
 * Element.
 */
export const DrawerFooter: React.FC<DrawerFooterProps> =
(props: DrawerFooterProps) => {
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
    <DrawerCard
      className={clsx(props.className, classes.paper)}
    >
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
    </DrawerCard>
  );
};

export default DrawerFooter;
