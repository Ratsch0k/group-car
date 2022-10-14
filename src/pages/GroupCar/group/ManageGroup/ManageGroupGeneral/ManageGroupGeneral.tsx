import {
  alpha,
  Box,
  createStyles,
  Grid,
  Hidden,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import {Edit, Save} from '@material-ui/icons';
import {unwrapResult} from '@reduxjs/toolkit';
import {useFormik} from 'formik';
import {Button, GroupCarTheme, ProgressButton} from 'lib';
import AttributeField from 'lib/components/AttributeField';
import AttributeTextField from
  'lib/components/AttributeField/AttributeTextField';
import SettingsTabTitle from 'lib/components/Settings/SettingsTabTitle';
import {useAppDispatch, useShallowAppSelector} from 'lib/redux/hooks';
import {getSelectedGroup, isAdminOfSelectedGroup} from 'lib/redux/slices/group';
import {updateGroup} from 'lib/redux/slices/group/groupThunks';
import {groupDescriptionValidator, groupNameValidator} from 'lib/validators';
import React, {useCallback, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import * as yup from 'yup';

const useStyles = makeStyles((theme: GroupCarTheme) => createStyles({
  content: {
    height: '100%',
    [theme.breakpoints.down('md')]: {
      paddingBottom: theme.spacing(3),
    },
  },
  actions: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: alpha(theme.palette.background.paper, 0.1),
    backdropFilter: 'blur(16px)',
    marginLeft: `-${theme.spacing(3)}px`,
    padding: theme.spacing(1),
    width: '100%',
    [theme.breakpoints.down('md')]: {
      width: `calc(100% - ${theme.spacing(2)}px)`,
    },
    [theme.breakpoints.only('sm')]: {
      borderRadius: `0px 0px ${theme.shape.borderRadiusSized.large}px ` +
        `${theme.shape.borderRadiusSized.large}px`,
    },
  },
}));

export const ManageGroupGeneral = (): JSX.Element => {
  const group = useShallowAppSelector(getSelectedGroup);
  const {t} = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const classes = useStyles();
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));
  const dispatch = useAppDispatch();
  const isAdmin = useShallowAppSelector(isAdminOfSelectedGroup);

  const validationSchema = yup.object({
    name: groupNameValidator,
    description: groupDescriptionValidator,
  });

  const formik = useFormik({
    initialValues: {
      name: group?.name,
      description: group?.description,
    },
    validationSchema,
    onSubmit: async (values) => {
      if (values.name && group) {
        formik.setSubmitting(true);

        try {
          unwrapResult(await dispatch(
            updateGroup({
              id: group.id,
              name: values.name,
              description: values.description,
            }),
          ));
        } catch (e) {
          console.log('ERROR');
        }

        setIsEditing(false);
        formik.setSubmitting(false);
      }
    },
  });

  const inputChanged = useMemo(() => {
    if (group) {
      return group.name !== formik.values.name ||
        group.description !== formik.values.description;
    } else {
      return false;
    }
  }, [group, formik.values]);

  const handleCancel = useCallback(() => {
    formik.resetForm();

    setIsEditing(false);
  }, []);

  const actions = useMemo(() => {
    if (!isEditing) {
      return (
        <Grid container justifyContent={mdUp ? undefined : 'flex-end'}>
          <Grid item>
            <Button
              key='manage-group-general-edit'
              color='primary'
              variant='contained'
              onClick={() => setIsEditing(true)}
              size='large'
              startIcon={<Edit />}
            >
              {t('misc.edit')}
            </Button>
          </Grid>
        </Grid>
      );
    } else {
      return (
        <Grid container spacing={2} justifyContent='space-evenly'>
          <Grid item xs={6} md='auto'>
            <Button
              size='large'
              onClick={handleCancel}
              fullWidth={!mdUp}
              key='manage-group-general-cancel'
            >
              {t('misc.cancel')}
            </Button>
          </Grid>
          <Grid item xs={6} md='auto'>
            <ProgressButton
              size='large'
              key='manage-group-general-save'
              color='primary'
              variant='contained'
              disabled={!inputChanged || Object.keys(formik.errors).length > 0}
              startIcon={<Save/>}
              loading={formik.isSubmitting}
              fullWidth={!mdUp}
              type='submit'
            >
              {t('misc.save')}
            </ProgressButton>
          </Grid>
        </Grid>
      );
    }
  }, [isEditing, inputChanged, formik.isSubmitting, mdUp, formik.errors]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <SettingsTabTitle
        actions={mdUp && isAdmin ? actions : undefined}
      >
        {t('modals.group.manage.tabs.general.title')}
      </SettingsTabTitle>
      <Typography color='textSecondary'>
        {t('modals.group.manage.tabs.general.description')}
      </Typography>
      <br />
      <Box className={classes.content}>
        <AttributeField
          editable={isEditing}
          label={t('misc.name')}
        >
          {
            isEditing ?
              <AttributeTextField
                formik={formik}
                name='name'
                disableHelperTextPadding
              />:
              group?.name
          }
        </AttributeField>
        <AttributeField
          label={t('misc.description')}
        >
          {
            isEditing ?
              <AttributeTextField
                formik={formik}
                name='description'
                disableHelperTextPadding
                multiline
              />:
              group?.description?.split('\n')
                .map((line, index) =>
                  [line, <br key={`group-desc-line-${index}`}/>])
          }
        </AttributeField>
      </Box>
      {
        isAdmin &&
          <Hidden mdUp>
            <Box className={classes.actions}>
              {actions}
            </Box>
          </Hidden>
      }
    </form>
  );
};

export default ManageGroupGeneral;
