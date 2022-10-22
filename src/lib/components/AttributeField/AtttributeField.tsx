import React, {
  ComponentPropsWithRef,
  forwardRef,
} from 'react';
import {
  alpha,
  createStyles,
  Grid,
  GridProps,
  makeStyles,
  TextFieldProps,
  Typography, useMediaQuery, useTheme,
} from '@material-ui/core';
import {GroupCarTheme} from '../../theme';

export interface AttributeFieldProps extends ComponentPropsWithRef<'div'> {
  label: string | React.ReactNode;
  breakpoint?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  editable?: boolean;
  TextFieldProps?: TextFieldProps;
  ContentProps?: GridProps;
}

const useStyles = makeStyles((theme: GroupCarTheme) => createStyles({
  children: {
  },
  content: {
    flex: '1 1',
    minWidth: 0,
    overflow: 'hidden',
    padding: '0px !important',
    [theme.breakpoints.down('sm')]: {
      padding: `${theme.spacing(1)}px !important`,
    },
  },
  label: {
    fontWeight: 'bold',
    color: theme.palette.primary.main,
    padding: theme.spacing(0.5),
  },
  root: {
    background: alpha(theme.palette.primary.main, 0.08),
    borderRadius: theme.shape.borderRadius,
    margin: `${theme.spacing(1)}px 0px`,
    padding: theme.spacing(1),
    width: '100%',
  },
  title: {
    flexBasis: 100,
  },
}));

export const AttributeField =
forwardRef<HTMLDivElement, AttributeFieldProps>((
  props,
  ref,
) => {
  const {
    label,
    breakpoint = 'sm',
    children,
    ContentProps,
    ...rest
  } = props;
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
      <Grid
        item
        className={isUp ? classes.title : undefined}
        container
        alignItems='flex-start'
      >
        <Typography variant='body2' className={classes.label}>
          {label}
        </Typography>
      </Grid>
      <Grid
        item
        className={classes.content}
        container
        alignItems='center'
        {...ContentProps}
      >
        {children}
      </Grid>
    </Grid>
  );
});

AttributeField.displayName = 'AttributeField';


export default AttributeField;
