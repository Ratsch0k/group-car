import React, {useContext} from 'react';
import {Grid} from '@material-ui/core';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {useTranslation} from 'react-i18next';
import {
  AuthContext,
  ProgressButton,
  PasswordTextField,
  FormTextField,
} from 'lib';

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
          <FormTextField
            autoFocus
            label={t('form.username') + ' *'}
            id='login-username'
            name='username'
            formik={formik}
          />
        </Grid>
        <Grid item xs={12}>
          <PasswordTextField
            id='login-password'
            name='password'
            label={t('form.password') + ' *'}
            formik={formik}
          />
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
