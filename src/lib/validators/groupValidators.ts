import * as yup from 'yup';

export const groupNameValidator = yup.string()
  .required('form.error.required')
  .trim()
  .min(5, () => ({key: 'form.error.tooShort', options: {min: 5}}))
  .max(30, () => ({key: 'form.error.tooLong', options: {max: 30}}));
export const groupDescriptionValidator = yup.string();
