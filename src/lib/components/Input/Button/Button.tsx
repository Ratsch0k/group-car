import {
  ButtonProps as MUIButtonProps,
  makeStyles,
  Button as MUIButton, alpha, useTheme, createStyles,
} from '@material-ui/core';
import React from 'react';
import {GroupCarTheme} from '../../../theme';
import clsx from 'clsx';
import {glowShadow} from '../../../util/glowShadow';

interface StyleProps {
  glow: string;
}

const useStyles = makeStyles<
GroupCarTheme, StyleProps
>((theme) => createStyles({
  contained: {
    'boxShadow': 'unset',
    '&:hover': {
      boxShadow: 'unset',
    },
  },
  label: {
    fontWeight: 'bold',
  },
  glow: ({glow}) => ({
    'boxShadow': glowShadow(glow, 2),
    '&:hover': {
      boxShadow: glowShadow(glow, 2),
    },
  }),
  textPrimary: {
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.08),
    },
  },
}));

export interface ButtonProps extends MUIButtonProps {
  noBold?: boolean;
  glow?: 'primary' | 'secondary';
}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((
  props,
  ref,
) => {
  const {classes, noBold, glow, ...rest} = props;
  const theme = useTheme();
  const customClasses = useStyles(
    {glow: theme.palette[glow || 'primary'].main},
  );

  return (
    <MUIButton
      ref={ref}
      classes={{
        contained: clsx(customClasses.contained, {[customClasses.glow]: glow}),
        label: !noBold ? customClasses.label : undefined,
        textPrimary: customClasses.textPrimary,
        ...classes,
      }}
      {...rest}
    />
  );
});

export default Button;
