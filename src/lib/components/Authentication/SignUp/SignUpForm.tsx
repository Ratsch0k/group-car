import React, {useState} from 'react';
import {TextField, Grid, Container} from '@material-ui/core';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {useTranslation} from 'react-i18next';
import GenerateProfilePic from './GenerateProfilePic/GenProfilePic';
import {SignUpRequest, ProgressButton, PasswordTextField} from 'lib';

export interface SignUpFormProps {
  withSubmit?: boolean;
  onFinished?(): void;
  setLoading?(arg0: boolean): void;
  signUp(
    username: string,
    email: string,
    password: string,
    offset: number
    ): SignUpRequest;
}

export const SignUpForm: React.FC<SignUpFormProps> =
(props: SignUpFormProps) => {
  const {t} = useTranslation();
  const [offset, setOffset] = useState<number>(0);

  const validationSchema = yup.object({
    username: yup.string().required(t('form.error.required'))
        .min(3, t('form.error.usernameToShort'))
        .matches(/^(\S)*$/, {message: t('form.error.usernameWhitespace')}),
    email: yup.string().email(t('form.error.invalidEmail'))
        .required(t('form.error.required')),
    password: yup.string().min(6, t('form.error.atLeast6'))
        .required(t('form.error.required')),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: (values) => {
      props.setLoading && props.setLoading(true);
      props.signUp(
          values.username,
          values.email,
          values.password,
          offset,
      ).request.finally(() => {
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
        alignItems='stretch'
      >
        <Grid item>
          <Container>
            <GenerateProfilePic
              username={formik.values.username}
              offset={offset}
              setOffset={setOffset}
            />
          </Container>
        </Grid>
        <Grid item>
          <TextField
            autoFocus
            fullWidth
            variant='outlined'
            label={t('form.username') + ' *'}
            id='signup-username'
            size='small'
            name='username'
            error={formik.touched.username &&
              formik.errors.username !==
              undefined}
            helperText={formik.touched.username ?
              formik.errors.username || ' ' :
              ' '}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.username} />
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            variant='outlined'
            label={t('form.email') + ' *'}
            id='signup-email'
            size='small'
            name='email'
            type='email'
            onBlur={formik.handleBlur}
            error={formik.touched.email &&
            formik.errors.email !==
            undefined}
            helperText={formik.touched.email ?
              formik.errors.email || ' ' :
              ' '}
            onChange={formik.handleChange}
            value={formik.values.email} />
        </Grid>
        <Grid item>
          <PasswordTextField
            fullWidth
            variant='outlined'
            id='signup-password'
            size='small'
            name='password'
            label={t('form.password') + ' *'}
            onBlur={formik.handleBlur}
            error={formik.touched.password &&
            formik.errors.password !==
            undefined}
            helperText={formik.touched.password ?
              formik.errors.password || ' ' :
              ' '}
            value={formik.values.password}
            onChange={formik.handleChange} />
        </Grid>
        {
          props.withSubmit &&
          <Grid item>
            <ProgressButton
              id='signup-submit'
              fullWidth
              type='submit'
              loading={formik.isSubmitting}
              variant='contained'
              color='primary'
            >
              {t('form.sign-up')}
            </ProgressButton>
          </Grid>
        }
      </Grid>
    </form>
  );
};

export default SignUpForm;
