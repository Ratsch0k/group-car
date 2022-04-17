import React from 'react';
import {
  createStyles,
  DialogProps,
  Dialog as MUIDialog,
  makeStyles,
} from '@material-ui/core';
import {GroupCarTheme} from '../../theme';

const useStyles = makeStyles((theme: GroupCarTheme) => createStyles({
  rounded: {
    borderRadius: theme.shape.borderRadiusSized.large,
  },
}));

export const Dialog = React.forwardRef<HTMLDivElement, DialogProps>((
  props: DialogProps,
  ref,
) => {
  const {classes, ...rest} = props;
  const customClasses = useStyles();

  return (
    <MUIDialog
      classes={{
        paper: customClasses.rounded,
        ...classes,
      }}
      ref={ref}
      {...rest}
    />
  );
});

Dialog.displayName = 'Dialog';

export default Dialog;
