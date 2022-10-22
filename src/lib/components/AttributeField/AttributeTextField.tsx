import {
  createStyles,
  makeStyles,
} from '@material-ui/core';
import {GroupCarTheme} from 'lib/theme';
import {FormTextField, FormTextFieldProps} from '../Input';
import React from 'react';

const useStyles = makeStyles((theme: GroupCarTheme) => createStyles({
  root: {
    'background': theme.palette.background.paper,
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.dark,
    },
  },
  notched: {
    borderColor: theme.palette.primary.main,
  },
  dense: {
    margin: 0,
  },
}));

export const AttributeTextField = (props: FormTextFieldProps): JSX.Element => {
  const classes = useStyles();

  return (
    <FormTextField
      size='small'
      fullWidth
      margin='dense'
      variant='outlined'
      InputProps={{
        classes: {
          root: classes.root,
          notchedOutline: classes.notched,
        },
      }}
      classes={{
        root: classes.dense,
      }}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...props as any}
    />
  );
};

export default AttributeTextField;
