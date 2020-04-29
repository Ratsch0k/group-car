import React from 'react';
import {
  Button,
  CircularProgress,
  makeStyles,
  createStyles,
  Box,
} from '@material-ui/core';

type Theme = import('@material-ui/core').Theme;
type ButtonProps = import('@material-ui/core').ButtonProps;

export interface ProgressButtonProps extends ButtonProps {
  loading?: boolean;
  progressSize?: number;
}

const ProgressButton: React.FC<ProgressButtonProps> = (props) => {
  const {
    loading,
    children,
    disabled,
    progressSize = 28,
    ...rest
  } = props;

  const useStyle = makeStyles((theme: Theme) =>
    createStyles({
      wrapper: {
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
    <Box className={classes.wrapper}>
      <Button {...rest} disabled={disabled || loading}>
        {children}
      </Button>
      {
        loading &&
        <CircularProgress
          className={classes.progress}
          color='secondary'
          size={progressSize}
        />
      }
    </Box>
  );
};

export default ProgressButton;
