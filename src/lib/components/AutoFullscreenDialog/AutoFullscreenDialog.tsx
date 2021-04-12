import {DialogProps, Dialog, useMediaQuery} from '@material-ui/core';
import React from 'react';
import {Breakpoint} from '@material-ui/core/styles/createBreakpoints';
import {useTheme} from '@material-ui/styles';
import {GroupCarTheme} from 'lib/theme';

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

/**
 * Variant of the dialog which switches to fullscreen once the screen width is
 * smaller than the defined breakpoint.
 * @param props Props for element
 */
export const AutoFullscreenDialog: React.FC<AutoFullscreenDialogProps> =
(props) => {
  const {children, breakpoint, ...rest} = props;

  const theme = useTheme<GroupCarTheme>();


  // Check if screen width is smaller than the defined breakpoint
  const largerThanBreakpoint = useMediaQuery(
    theme.breakpoints.up(breakpoint || 'lg'),
  );

  return (
    <Dialog maxWidth={breakpoint} fullScreen={!largerThanBreakpoint} {...rest}>
      {children}
    </Dialog>
  );
};

export default AutoFullscreenDialog;
