import React, {
  ComponentPropsWithRef,
  forwardRef,
} from 'react';
import {
  createStyles,
  Grid,
  makeStyles,
  Typography, useMediaQuery, useTheme,
} from '@material-ui/core';
import {GroupCarTheme} from '../../theme';

export interface AttributeFieldProps extends ComponentPropsWithRef<'div'> {
  label: string | React.ReactNode;
  breakpoint?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const useStyles = makeStyles((theme: GroupCarTheme) => createStyles({
  root: {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    margin: `${theme.spacing(1)}px 0px`,
    padding: theme.spacing(1),
    width: '100%',
  },
  title: {
    flexBasis: 100,
  },
  content: {
    flex: '1 1',
  },
}));

export const AttributeField =
forwardRef<HTMLDivElement, AttributeFieldProps>((
  props,
  ref,
) => {
  const {label, children, breakpoint = 'sm', ...rest} = props;
  const classes = useStyles();
  const theme = useTheme();
  const isUp = useMediaQuery(theme.breakpoints.up(breakpoint));

  return (
    <Grid
      container
      direction={isUp ? 'row' : 'column'}
      spacing={2}
      className={classes.root}
      wrap='nowrap'
      ref={ref}
      {...rest}
    >
      <Grid item className={isUp ? classes.title : undefined}>
        <Typography variant='body2' color='primary'>
          <b>{label}</b>
        </Typography>
      </Grid>
      <Grid item className={classes.content}>
        {children}
      </Grid>
    </Grid>
  );
});

AttributeField.displayName = 'AttributeField';


export default AttributeField;
