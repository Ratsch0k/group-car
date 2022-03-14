import {Button, Grid} from '@material-ui/core';
import React from 'react';
import {Formik} from 'formik';
import * as yup from 'yup';
import {useTranslation} from 'react-i18next';
import {
  changePassword, FormTextFieldProps,
  PasswordTextField,
  ProgressButton,
} from '../../../../../lib';
import {password, confirm, newField} from '../../../../../lib/validators';
import useSnackbar from '../../../../../lib/hooks/useSnackbar';

export const TextField = (props: FormTextFieldProps): JSX.Element => {
  return (
    <PasswordTextField {...props} />
  );
};

const validationSchema = yup.object({
  old: yup.string().required('form.error.required'),
  new: password.concat(newField()),
  confirm: confirm(),
});

export interface ChangePasswordFormProps {
  onClose(): void;
}

export const ChangePasswordForm =
(props: ChangePasswordFormProps): JSX.Element => {
  const {t} = useTranslation();
  const {show} = useSnackbar();
  const {onClose} = props;

  return (
    <Formik
      initialValues={{
        old: '',
        new: '',
        confirm: '',
      }}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        await changePassword(values.old, values.new);
        show(
          'success',
          t('settings.account.security.successfullyChangedPassword'),
        );
        onClose();
      }}
    >
      {(props) =>
        <form onSubmit={props.handleSubmit}>
          <Grid container direction='column' spacing={1} wrap='nowrap'>
            <Grid item>
              <TextField
                name='old'
                formik={props}
                autoComplete='current-password'
                id='input-current-password'
                label={t('misc.currentPassword')}
              />
            </Grid>
            <Grid item>
              <TextField
                name='new'
                formik={props}
                id='input-new-password'
                autoComplete='new-password'
                label={t('misc.newPassword')}
              />
            </Grid>
            <Grid item>
              <TextField
                name='confirm'
                formik={props}
                autoComplete='new-password'
                id='input-confirm-new-password'
                label={t('misc.confirmNewPassword')}
              />
            </Grid>
            <Grid item>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <ProgressButton
                    disabled={!props.isValid || !props.dirty}
                    loading={props.isSubmitting}
                    id='change-password-button'
                    variant='contained'
                    fullWidth
                    color='primary'
                    type='submit'
                  >
                    {t('settings.account.security.changePassword')}
                  </ProgressButton>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button fullWidth onClick={onClose}>
                    {t('misc.cancel')}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      }
    </Formik>
  );
};

export default ChangePasswordForm;
