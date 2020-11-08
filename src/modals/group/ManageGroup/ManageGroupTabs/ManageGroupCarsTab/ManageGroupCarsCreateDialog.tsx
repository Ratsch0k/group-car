import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from '@material-ui/core';
import {useFormik} from 'formik';
import {
  CarColor,
  CarColorSelection,
  CarWithDriver,
  FormTextField,
  GroupWithOwnerAndMembersAndInvitesAndCars,
  ProgressButton,
  useApi,
} from 'lib';
import React, {useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import * as yup from 'yup';

export interface ManageGroupCarsCreateDialogProps {
  open: boolean;
  close: () => void;
  group: GroupWithOwnerAndMembersAndInvitesAndCars;
  additionalCars: CarWithDriver[];
  addCar(car: CarWithDriver): void;
}

export const ManageGroupCarsCreateDialog: React.FC<
  ManageGroupCarsCreateDialogProps
> = (props: ManageGroupCarsCreateDialogProps) => {
  const {open, close, group, additionalCars, addCar} = props;
  const {t} = useTranslation();
  const {createCar} = useApi();
  const availableColors = useMemo(() => {
    return Object.values(CarColor)
        .filter((color) =>
          additionalCars.every((car) => car.color !== color) &&
          group.cars.every((car) => car.color !== color));
  }, [additionalCars, group.cars]);
  const [color, setColor] = useState<CarColor>(availableColors[0]);


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
        const res = await createCar(group.id, values.name, color);
        addCar(res.data);
        formik.setSubmitting(false);
        handleClose();
      } catch (e) {
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
