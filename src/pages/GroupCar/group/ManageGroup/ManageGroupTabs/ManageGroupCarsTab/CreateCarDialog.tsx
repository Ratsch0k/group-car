import {
  Button, createStyles,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid, makeStyles,
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
  Dialog, GroupCarTheme,
} from 'lib';
import {useAppDispatch, useShallowAppSelector} from 'lib/redux/hooks';
import {
  createCar,
  getGroupCars,
  getSelectedGroup,
} from 'lib/redux/slices/group';
import React, {useEffect, useMemo, useState} from 'react';
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

const useStyles = makeStyles((theme: GroupCarTheme) => createStyles({
  action: {
    padding: theme.spacing(3),
  },
}));

/**
 * Dialog for creating a new car for the specified group.
 * @param props Props
 */
export const CreateCarDialog: React.FC<
ManageGroupCarsCreateDialogProps
> = (props: ManageGroupCarsCreateDialogProps) => {
  const {open, close} = props;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const group = useShallowAppSelector(getSelectedGroup)!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const cars = useShallowAppSelector(getGroupCars)!;
  const dispatch = useAppDispatch();
  const {t} = useTranslation();
  const availableColors = useMemo(() => {
    return Object.values(CarColor)
      .filter((color) =>
        cars.every((car) => car.color !== color));
  }, [cars]);
  const [color, setColor] = useState<CarColor>(availableColors[0]);
  const {show} = useSnackBar();
  const classes = useStyles();

  /**
   * If cars change and the current color is not available anymore,
   * set it to the first available one.
   */
  useEffect(() => {
    if (!availableColors.includes(color)) {
      setColor(availableColors[0]);
    }
  }, [cars, availableColors]);

  const validationSchema = useMemo(() => yup.object({
    name: yup.string().required(t('form.error.required'))
      .min(3, t('form.error.tooShort', {min: 3}))
      .max(30, t('form.error.tooLong', {max: 30}))
      .test(
        'not-used',
        t('form.error.alreadyInUse'),
        (value) => {
          return cars.every((c) => c.name !== value);
        }),
  }), [t, cars]);

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
          show('error', t('errors.CarAlreadyExists'));
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
        <DialogActions className={classes.action}>
          <Button
            disabled={formik.isSubmitting}
            onClick={handleClose}
          >
            {t('misc.close')}
          </Button>
          <ProgressButton
            color='primary'
            loading={formik.isSubmitting}
            disabled={!formik.isValid}
            type='submit'
            variant='contained'
            glow='primary'
          >
            {t('misc.create')}
          </ProgressButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateCarDialog;
