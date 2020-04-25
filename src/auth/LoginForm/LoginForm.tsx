import React from 'react';
import PasswordTextField from '../../lib/Input/PasswordTextField';
import {TextField, Button} from '@material-ui/core';
import axios from 'axios';
import {useFormik} from 'formik';
import * as yup from 'yup';

export interface LoginFormProps {
  withSubmit?: boolean;
}

const validationSchema = yup.object({
  username: yup.string().required('Required'),
  password: yup.string().required('Required'),
});

const LoginForm: React.FC<LoginFormProps> = (props: LoginFormProps) => {
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: (values) => {
      axios.put('/auth/login', values).finally(() => {
        formik.setSubmitting(false);
      });
    },
  });

  return (
    <form>
      <TextField
        variant='outlined'
        label='Username'
        id='login-username'
        size='small'
        name='username'
        error={formik.touched.username && formik.errors.username !== undefined}
        helperText={formik.touched.username ?
          formik.errors.username :
          undefined}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        value={formik.values.username} />
      <PasswordTextField
        variant='outlined'
        id='login-password'
        size='small'
        name='password'
        error={formik.touched.password && formik.errors.password !== undefined}
        helperText={formik.touched.password ?
          formik.errors.password :
          undefined}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        value={formik.values.password} />
      {
        props.withSubmit &&
          <Button
            onClick={formik.handleSubmit as any}
            variant='contained'
            color='primary'
            disabled={formik.isSubmitting}
          >
            Log in
          </Button>
      }

    </form>
  );
};

export default LoginForm;
