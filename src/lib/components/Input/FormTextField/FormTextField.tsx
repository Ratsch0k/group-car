import React from 'react';
import {TextField, BaseTextFieldProps, TextFieldProps} from '@material-ui/core';
import {Formik} from 'typings';
import {useTranslation} from 'react-i18next';
import {FormikProps} from 'formik';

interface FormTextFieldExtensionProps extends BaseTextFieldProps {
  formik?: Formik | FormikProps<Formik['initialValues']>;
  name: string;
}

export type FormTextFieldProps = FormTextFieldExtensionProps & TextFieldProps;

/**
 * Variant of the TextField with the following changed default values:
 *  - **fullWidth**: `true`
 *  - **size**: `'small'`
 *  - **variant**: `'outlined'`
 *
 * and which provides integration with Formik.
 * When the prop `formik` is provided the specified prop `name`
 * is used to set: `onBlur`, `onChange`, `disabled`, `error`,
 * `helperText` and `value`.
 * @param props Props
 */
export const FormTextField: React.FC<FormTextFieldProps> =
(props) => {
  const {name} = props;
  const formik = 'formik' in props ? props.formik : undefined;
  const {t} = useTranslation();

  if (formik) {
    return (
      <TextField
        fullWidth
        size='small'
        error={formik.touched[name] && formik.errors[name] !== undefined}
        helperText={formik.touched[name] ?
          t(formik.errors[name]) || ' ' :
          ' '}
        variant={
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          'outlined' as any
        }
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        value={formik.values[name]}
        disabled={formik.isSubmitting}
        {...props}
      />
    );
  } else {
    return (
      <TextField
        fullWidth
        size='small'
        variant={
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          'outlined' as any
        }
        {...props}
      />
    );
  }
};

export default FormTextField;
