import {
  ButtonProps as MUIButtonProps,
  makeStyles,
  Button as MUIButton,
  alpha,
  createStyles,
} from '@material-ui/core';
import React from 'react';
import {GroupCarTheme} from '../../../theme';
import clsx from 'clsx';
import coloredShadow from 'lib/util/coloredShadow';


const useStyles = makeStyles<
GroupCarTheme
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
  labelTextEllipsis: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'inline-block',
    whiteSpace: 'nowrap',
  },
  shadow: {
    'boxShadow': coloredShadow(theme.palette.common.black, 2),
    '&:hover': {
      boxShadow: coloredShadow(theme.palette.common.black, 3),
    },
  },
  shadowPrimary: {
    'boxShadow': coloredShadow(theme.palette.primary.main, 2),
    '&:hover': {
      boxShadow: coloredShadow(theme.palette.primary.dark, 3),
    },
  },
  shadowSecondary: {
    'boxShadow': coloredShadow(theme.palette.secondary.main, 2),
    '&:hover': {
      boxShadow: coloredShadow(theme.palette.secondary.dark, 3),
    },
  },
  textPrimary: {
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.08),
    },
  },
  disableCap: {
    textTransform: 'initial',
  },
}));

export interface ButtonProps extends MUIButtonProps {
  noBold?: boolean;
  shadow?: boolean;
  textEllipsis?: boolean;
  disableCapitalization?: boolean;
}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((
  props,
  ref,
) => {
  const {
    classes,
    noBold,
    textEllipsis,
    shadow,
    disableCapitalization,
    disabled,
    color,
    ...rest
  } = props;
  const customClasses = useStyles();

  return (
    <MUIButton
      ref={ref}
      classes={{
        contained: clsx(
          customClasses.contained,
          !disabled && shadow ?
            {
              [customClasses.shadowPrimary]: color === 'primary',
              [customClasses.shadowSecondary]: color === 'secondary',
              [customClasses.shadow]: color === 'default',
            }:
            undefined,
        ),
        label: clsx({
          [customClasses.label]: !noBold,
          [customClasses.labelTextEllipsis]: textEllipsis,
          [customClasses.disableCap]: disableCapitalization,
        }),
        textPrimary: customClasses.textPrimary,
        ...classes,
      }}
      color={color}
      disabled={disabled}
      {...rest}
    />
  );
});

Button.displayName = 'Button';

export default Button;
