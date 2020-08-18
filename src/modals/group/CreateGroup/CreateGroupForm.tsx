import React from 'react';
import {Grid} from '@material-ui/core';
import {FormTextField, ProgressButton} from 'lib';
import {useTranslation} from 'react-i18next';
import {useFormik} from 'formik';
import * as yup from 'yup';

const minNameLength = 4;
const maxNameLength = 30;
const maxDescriptionLength = 200;

/**
 * Form of the create group dialog.
 */
export const CreateGroupForm: React.FC = () => {
  const {t} = useTranslation();

  const validationSchema = yup.object({
    name: yup.string().required(t('form.error.required'))
        .min(
            minNameLength,
            t(
                'form.error.tooShort',
                {min: minNameLength},
            ),
        )
        .max(
            maxNameLength,
            t(
                'form.error.tooLong',
                {max: maxNameLength},
            ),
        ),
    description: yup.string()
        .max(
            maxDescriptionLength,
            t(
                'form.error.tooLong',
                {max: maxDescriptionLength},
            ),
        ),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      description: undefined,
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid
        container
        direction='column'
        spacing={1}
      >
        <Grid item>
          <FormTextField
            id='create-group-name'
            label={t('modals.group.create.name')}
            name='name'
            formik={formik}
          />
        </Grid>
        <Grid item>
          <FormTextField
            id='create-group-description'
            label={t('modals.group.create.description')}
            multiline
            name='description'
            formik={formik}
          />
        </Grid>
        <Grid item>
          <ProgressButton
            fullWidth
            id='create-group-submit'
            loading={formik.isSubmitting}
            variant='contained'
            type='submit'
            color='primary'
          >
            {t('modals.group.create.create')}
          </ProgressButton>
        </Grid>
      </Grid>
    </form>
  );
};

export default CreateGroupForm;
