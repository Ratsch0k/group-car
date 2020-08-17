import React, {useContext} from 'react';
import {TextField, Grid} from '@material-ui/core';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {useTranslation} from 'react-i18next';
import {AuthContext, ProgressButton, PasswordTextField} from 'lib';

export interface LoginFormProps {
  withSubmit?: boolean;
  onFinished?(): void;
  setLoading?(arg0: boolean): void;
}

export const LoginForm: React.FC<LoginFormProps> = (props: LoginFormProps) => {
  const {t} = useTranslation();
  const auth = useContext(AuthContext);

  const validationSchema = yup.object({
    username: yup.string().required(t('form.error.required')),
    password: yup.string().required(t('form.error.required')),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: (values) => {
      props.setLoading && props.setLoading(true);
      auth.login(values.username, values.password).request.then(() => {
        props.setLoading && props.setLoading(false);
        props.onFinished && props.onFinished();
      }).catch(() => {
        props.setLoading && props.setLoading(false);
        formik.setSubmitting(false);
      });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid
        container
        spacing={1}
        direction='column'
        justify='flex-start'
        alignItems='stretch'>
        <Grid item xs={12}>
          <TextField
            autoFocus
            variant='outlined'
            label={t('form.username') + ' *'}
            id='login-username'
            size='small'
            fullWidth
            name='username'
            error={formik.touched.username && formik.errors.username !==
            undefined}
            helperText={formik.touched.username ?
               formik.errors.username || ' ' :
              ' '}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.username} />
        </Grid>
        <Grid item xs={12}>
          <PasswordTextField
            variant='outlined'
            id='login-password'
            size='small'
            name='password'
            label={t('form.password') + ' *'}
            fullWidth
            error={formik.touched.password && formik.errors.password !==
            undefined}
            helperText={formik.touched.password ?
              formik.errors.password || ' ' :
              ' '}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.password} />
        </Grid>
        {
          props.withSubmit &&
          <Grid item xs={12}>
            <ProgressButton
              fullWidth
              id='login-submit'
              type='submit'
              variant='contained'
              color='primary'
              loading={formik.isSubmitting}
            >
              {t('form.login')}
            </ProgressButton>
          </Grid>
        }
      </Grid>
    </form>
  );
};

export default LoginForm;
