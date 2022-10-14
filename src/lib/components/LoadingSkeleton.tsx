import {useTheme} from '@material-ui/core';
import {SkeletonProps, Skeleton} from '@material-ui/lab';
import {GroupCarTheme} from 'lib/theme';
import React from 'react';

const LoadingSkeleton = (props: SkeletonProps): JSX.Element => {
  const theme = useTheme<GroupCarTheme>();

  return (
    <Skeleton
      animation='wave'
      variant='text'
      style={{borderRadius: theme.shape.borderRadiusSized.default}}
      {...props}
    />
  );
};

export default LoadingSkeleton;
