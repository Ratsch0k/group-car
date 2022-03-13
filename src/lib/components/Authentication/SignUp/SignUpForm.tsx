import React, {useState} from 'react';
import {Grid, Container} from '@material-ui/core';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {useTranslation} from 'react-i18next';
import GenerateProfilePic from './GenerateProfilePic/GenProfilePic';
import {ProgressButton, PasswordTextField} from 'lib';
import {FormTextField} from 'lib/components/Input';
import {useComponentIsMounted} from 'lib/hooks';
import {username, email, password} from '../../../validators';

export interface SignUpFormProps {
  withSubmit?: boolean;
  onFinished?(): void;
  setLoading?(arg0: boolean): void;
  signUp(
    username: string,
    email: string,
    password: string,
    offset: number
  ): Promise<void>;
}

export const SignUpForm: React.FC<SignUpFormProps> =
(props: SignUpFormProps) => {
  const {t} = useTranslation();
  const [offset, setOffset] = useState<number>(0);
  const isMounted = useComponentIsMounted();

  const validationSchema = yup.object({
    username,
    email,
    password,
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
      ).finally(() => {
        if (isMounted.current) {
          formik.setSubmitting(false);
        }
      });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid
        container
        spacing={1}
        direction='column'
        justifyContent='flex-start'
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
          <FormTextField
            autoFocus
            label={t('form.username') + ' *'}
            id='signup-username'
            name='username'
            formik={formik}
          />
        </Grid>
        <Grid item>
          <FormTextField
            formik={formik}
            label={t('form.email') + ' *'}
            id='signup-email'
            name='email'
            type='email'
          />
        </Grid>
        <Grid item>
          <PasswordTextField
            formik={formik}
            id='signup-password'
            name='password'
            label={t('form.password') + ' *'}
          />
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
