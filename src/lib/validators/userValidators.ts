import * as yup from 'yup';
import {StringSchema} from 'yup';

/**
 * Creates confirm validator which validates that the named field
 * is equal to the value to confirm.
 * @param fieldName Field name of the field to confirm
 */
export const confirm = (fieldName = 'new'): StringSchema<string> =>
  yup.string().required('form.error.required')
    .test(
      'is-confirmed',
      'form.error.notConfirmed',
      async function(value) {
      // Compare new and this field
      // eslint-disable-next-line no-invalid-this
        return this.parent[fieldName] === value;
      });

export const newField = (fieldName = 'old'): StringSchema<string> =>
  yup
    .string().required('form.error.required')
    .test(
      'is-new',
      'form.error.notNew',
      async function(value) {
        // eslint-disable-next-line no-invalid-this
        return this.parent[fieldName] !== value;
      },
    );
