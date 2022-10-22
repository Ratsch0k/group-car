import React from 'react';
import {
  CircularProgress,
  makeStyles,
  createStyles,
} from '@material-ui/core';
import {Button, ButtonProps} from '../Button';

export interface ProgressButtonProps extends ButtonProps {
  loading?: boolean;
  progressSize?: number;
}

export const ProgressButton: React.FC<ProgressButtonProps> = (props) => {
  const {
    loading,
    children,
    disabled,
    progressSize = 28,
    ...rest
  } = props;

  const useStyle = makeStyles(() =>
    createStyles({
      button: {
        position: 'relative',
      },
      progress: {
        position: 'absolute',
        top: `50%`,
        left: '50%',
        marginLeft: `-${Math.floor(progressSize / 2)}px`,
        marginTop: `-${Math.floor(progressSize / 2)}px`,
      },
    }),
  );

  const classes = useStyle();

  return (
    <Button
      className={classes.button}
      {...rest}
      disabled={disabled || loading}
    >
      {children}
      {
        loading &&
        <CircularProgress
          className={classes.progress}
          color='primary'
          size={progressSize}
        />
      }
    </Button>
  );
};

export default ProgressButton;
