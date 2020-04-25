import React from 'react';
import PasswordTextField from '../../lib/Input/PasswordTextField';
import {TextField, Button} from '@material-ui/core';
import axios from 'axios';
import {useFormik} from 'formik';
import * as yup from 'yup';

export interface SignUpFormProps {
  withSubmit?: boolean;
}

const validationSchema = yup.object({
  username: yup.string().required('Required'),
  email: yup.string().email('In not a valid email').required('Required'),
  password: yup.string().min(6, 'Must at least 6 characters long')
      .required('Required'),
});

const SignUpForm: React.FC<SignUpFormProps> = (props: SignUpFormProps) => {
  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: (values) => {
      axios.put('/auth/sign-up', values).finally(() => {
        formik.setSubmitting(false);
      });
    },
  });

  return (
    <form>
      <TextField
        variant='outlined'
        label='Username *'
        id='signup-username'
        size='small'
        name='username'
        error={formik.touched.username && formik.errors.username !== undefined}
        helperText={formik.touched.username ?
          formik.errors.username :
          undefined}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        value={formik.values.username} />
      <TextField
        variant='outlined'
        label='Email *'
        id='signup-email'
        size='small'
        name='email'
        type='email'
        onBlur={formik.handleBlur}
        error={formik.touched.email && formik.errors.email !== undefined}
        helperText={formik.touched.email ?
          formik.errors.email :
          undefined}
        onChange={formik.handleChange}
        value={formik.values.email} />
      <PasswordTextField
        variant='outlined'
        id='signup-password'
        size='small'
        name='password'
        onBlur={formik.handleBlur}
        error={formik.touched.password && formik.errors.password !== undefined}
        helperText={formik.touched.password ?
          formik.errors.password :
          undefined}
        value={formik.values.password}
        onChange={formik.handleChange} />
      {
        props.withSubmit &&
          <Button
            disabled={formik.isSubmitting}
            onClick={formik.handleSubmit as any}
            variant='contained'
            color='primary'
          >
            Sign up
          </Button>
      }

    </form>
  );
};

export default SignUpForm;
