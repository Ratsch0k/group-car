import * as yup from 'yup';

export const username = yup.string().required('form.error.required')
  .min(3, 'form.error.usernameToShort')
  .matches(/^(\S)*$/, {message: 'form.error.usernameWhitespace'});
export const email = yup.string().email('form.error.invalidEmail')
  .required('form.error.required');
export const password = yup.string().min(6, 'form.error.atLeast6')
  .required('form.error.required');
