import {
  DialogProps,
  Dialog,
  useMediaQuery,
  makeStyles,
  createStyles,
} from '@material-ui/core';
import React from 'react';
import {Breakpoint} from '@material-ui/core/styles/createBreakpoints';
import {useTheme} from '@material-ui/styles';
import {GroupCarTheme} from 'lib/theme';
import clsx from 'clsx';

/**
 * Props for the auto fullscreen dialog.
 */
export interface AutoFullscreenDialogProps extends DialogProps {
  /**
   * Defines at which breakpoint the dialog should switch
   * to fullscreen.
   *
   * Default values is 'lg'
   */
  breakpoint?: Breakpoint;
}

const useStyles = makeStyles((theme: GroupCarTheme) => createStyles({
  paper: {
    borderRadius: theme.shape.borderRadiusSized.large,
  },
  backdropRoot: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
}));

/**
 * Variant of the dialog which switches to fullscreen once the screen width is
 * smaller than the defined breakpoint.
 * @param props Props for element
 */
export const AutoFullscreenDialog: React.FC<AutoFullscreenDialogProps> =
(props) => {
  const {children, breakpoint, classes, ...rest} = props;
  const {paper, ...unusedClasses} = classes || {};
  const customClasses = useStyles();

  const theme = useTheme<GroupCarTheme>();


  // Check if screen width is smaller than the defined breakpoint
  const largerThanBreakpoint = useMediaQuery(
    theme.breakpoints.up(breakpoint || 'lg'),
  );

  return (
    <Dialog
      maxWidth={breakpoint}
      fullScreen={!largerThanBreakpoint}
      classes={{
        paper: clsx(paper, {
          [customClasses.paper]: largerThanBreakpoint,
        }),
        ...unusedClasses,
      }}
      BackdropProps={{
        classes: {
          root: customClasses.backdropRoot,
        },
      }}
      className={props.className}
      {...rest}
    >
      {children}
    </Dialog>
  );
};

export default AutoFullscreenDialog;
