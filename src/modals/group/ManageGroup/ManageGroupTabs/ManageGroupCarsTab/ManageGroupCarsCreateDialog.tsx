import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from '@material-ui/core';
import {unwrapResult} from '@reduxjs/toolkit';
import {useFormik} from 'formik';
import {
  CarAlreadyExistsError,
  CarColor,
  CarColorSelection,
  FormTextField,
  ProgressButton,
  useSnackBar,
} from 'lib';
import {useAppDispatch, useAppSelector} from 'lib/redux/hooks';
import {createCar, getSelectedGroup} from 'lib/redux/slices/group';
import React, {useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import * as yup from 'yup';

/**
 * Props for the create car dialog.
 */
export interface ManageGroupCarsCreateDialogProps {
  /**
   * Whether or not this dialog should be open.
   */
  open: boolean;

  /**
   * Callback to close the dialog.
   */
  close: () => void;
}

/**
 * Dialog for creating a new car for the specified group.
 * @param props Props
 */
export const ManageGroupCarsCreateDialog: React.FC<
ManageGroupCarsCreateDialogProps
> = (props: ManageGroupCarsCreateDialogProps) => {
  const {open, close} = props;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const group = useAppSelector(getSelectedGroup)!;
  const dispatch = useAppDispatch();
  const {t} = useTranslation();
  const availableColors = useMemo(() => {
    return Object.values(CarColor)
      .filter((color) =>
        group.cars.every((car) => car.color !== color));
  }, [group.cars]);
  const [color, setColor] = useState<CarColor>(availableColors[0]);
  const {show} = useSnackBar();


  const validationSchema = useMemo(() => yup.object({
    name: yup.string().required(t('form.error.required'))
      .min(3, t('form.error.tooShort', {min: 3}))
      .max(30, t('form.error.tooLong', {max: 30})),
  }), [t]);

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      formik.setSubmitting(true);

      try {
        unwrapResult(await dispatch(
          createCar({groupId: group.id, name: values.name, color})));
        formik.setSubmitting(false);
        handleClose();
      } catch (e) {
        if (e instanceof CarAlreadyExistsError) {
          show('error', t('errors.carAlreadyExists'));
        }
        formik.setSubmitting(false);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    close();
  };

  return (
    <Dialog open={open}>
      <DialogTitle>
        {t('modals.group.manage.tabs.cars.create.title')}
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid
            container
            direction='column'
            spacing={2}
          >
            <Grid item>
              <FormTextField
                formik={formik}
                label={t('form.name') + ' *'}
                id='create-car-name'
                name='name'
                type='text'
                autoFocus
              />
            </Grid>
            <Grid item>
              <CarColorSelection
                setColor={setColor}
                availableColors={availableColors}
                id='create-car-color'
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={formik.isSubmitting}
            onClick={handleClose}
          >
            {t('misc.close')}
          </Button>
          <ProgressButton
            color='primary'
            loading={formik.isSubmitting}
            type='submit'
          >
            {t('misc.create')}
          </ProgressButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ManageGroupCarsCreateDialog;
