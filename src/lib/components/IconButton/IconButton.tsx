import React from 'react';
import {
  IconButtonProps as MUIIconButtonProps,
  Tooltip,
  IconButton as MUIIconButton, makeStyles, alpha, useTheme,
} from '@material-ui/core';
import {GroupCarTheme} from '../../theme';
import clsx from 'clsx';

type ExtendedProps = Omit<MUIIconButtonProps, 'color'>;

type ColorType = 'primary' |
'secondary' |
'default' |
'inherit' |
'error' |
'success' |
'warning' |
'info' |
string;

export interface IconButtonProps extends ExtendedProps {
  tooltip?: React.ReactChild | string;
  color?: ColorType;
}

const useStyles = makeStyles<GroupCarTheme, {color: string}>({
  button: ({color}) => ({
    'color': color,
    '&:hover': {
      backgroundColor: alpha(color, 0.08),
    },
  }),
});

const useGetColor = () => {
  const theme = useTheme();

  return (color: ColorType) => {
    switch (color) {
      case 'primary':
      case 'secondary':
      case 'error':
      case 'warning':
      case 'info':
      case 'success': {
        return theme.palette[color].main;
      }
      case 'inherit': {
        return 'inherit';
      }
      case 'default': {
        return theme.palette.common.black;
      }
      default: {
        return color;
      }
    }
  };
};

export const IconButton = (props: IconButtonProps): JSX.Element => {
  const {tooltip, className, color, ...rest} = props;
  const getColor = useGetColor();
  const customClasses = useStyles({color: getColor(color || 'default')});

  return (
    <Tooltip title={tooltip || ''}>
      <MUIIconButton
        className={clsx(className, customClasses.button)}
        {...rest}
      />
    </Tooltip>
  );
};

export default IconButton;
