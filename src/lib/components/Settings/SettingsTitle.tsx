import {useAppDispatch} from 'lib/redux/hooks';
import {closeModal} from 'lib/redux/slices/modalRouter/modalRouterSlice';
import {CloseableDialogTitle} from '../CloseableDialogTitle';
import React, {useCallback, useEffect, useRef} from 'react';
import {
  Grid,
  Hidden,
  IconButton,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import {ArrowBack} from '@material-ui/icons';

const useStyles = makeStyles({
  title: {
    fontWeight: 'bold',
  },
  button: {
    overflow: 'hidden',
  },
  titleWrapper: {
    flex: '1 1',
    minWidth: 0,
    fontWeight: 'bold',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});

export interface SettingsTitleProps {
  goBack: () => void;
  showBackButton?: boolean;
}


export const SettingsTitle: React.FC<SettingsTitleProps> = (props) => {
  const dispatch = useAppDispatch();
  const {goBack, showBackButton, children} = props;
  const classes = useStyles(showBackButton);
  const buttonRef = useRef<HTMLButtonElement>();
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));

  /**
   * Collapses or shows the close button depending on showBackButton.
   */
  const handleCollapse = useCallback(() => {
    if (buttonRef.current) {
      let originalWidth;
      if (showBackButton) {
        originalWidth = buttonRef.current.scrollWidth;
        buttonRef.current.style.width = `${originalWidth}px`;
      } else {
        originalWidth = buttonRef.current.getBoundingClientRect().width;
        buttonRef.current.style.width = '0px';
      }

      if (buttonRef.current.animate) {
        const collapseAnimation = buttonRef.current.animate([
          {
            width: showBackButton ? 0 : `${originalWidth}px`,
            offset: 0,
          },
        ], {
          duration: 250,
          easing: 'ease-in-out',
        });

        collapseAnimation.addEventListener('finish', () => {
          collapseAnimation.cancel();
        });

        collapseAnimation.play();
      }
    }
  }, [showBackButton]);

  /**
   * Handles the collapse of the close button.
   */
  useEffect(() => {
    if (buttonRef.current) {
      handleCollapse();
    }
  }, [showBackButton]);

  /**
   * Handles if the close button is attached to the DOM.
   *
   * Sets the size of the button to zero if showBackButton is false.
   */
  const handleNodeAttached = useCallback((node: HTMLButtonElement) => {
    if (node) {
      buttonRef.current = node;

      if (!showBackButton) {
        buttonRef.current.style.width = '0px';
      }
    }
  }, []);

  return (
    <>
      <CloseableDialogTitle close={() => dispatch(closeModal())}>
        <Grid container alignItems='center' wrap='nowrap'>
          <Hidden mdUp>
            <Grid item innerRef={handleNodeAttached} className={classes.button}>
              <IconButton
                onClick={goBack}
                disabled={!showBackButton}
                size={mdUp ? 'medium' : 'small'}
              >
                <ArrowBack
                  fontSize={mdUp ? 'large' : 'default'}
                  color='action'
                />
              </IconButton>
            </Grid>
          </Hidden>
          <Grid item alignContent='center' className={classes.titleWrapper}>
            <Typography
              variant={mdUp ? 'h4' : 'h5'}
              className={classes.title}
              display='inline'
            >
              {children}
            </Typography>
          </Grid>
        </Grid>
      </CloseableDialogTitle>
    </>
  );
};

export default SettingsTitle;
