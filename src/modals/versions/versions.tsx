import React, {FC} from 'react';
import {
  CloseableDialogTitle,
  getVersions,
  BackendVersions,
  GroupCarTheme,
} from '../../lib';
import {useTranslation} from 'react-i18next';
import {useEffect, useState} from 'react';
import config from 'config';
import {
  CircularProgress, createStyles,
  Dialog,
  DialogContent, makeStyles,
  Typography,
} from '@material-ui/core';
import {useDispatch} from 'react-redux';
import {closeModal} from '../../lib/redux/slices/modalRouter/modalRouterSlice';

/**
 * Visualize the backend versions.
 * @param versions The object containing the backend versions
 */
export const VisualizeBackendVersions: FC<{versions: BackendVersions}> = (
  {versions}: {versions: BackendVersions},
) => {
  const mappedVersions = Object.entries(versions);
  const {t} = useTranslation();

  return (
    <>
      {
        mappedVersions.map(([key, version]) =>
          <Typography key={`version-backend-${key}`}>
            <b>
              {t('versions.' + key)}:{' '}
            </b>
            {version}
          </Typography>,
        )
      }
    </>
  );
};

const useStyles = makeStyles((theme: GroupCarTheme) =>
  createStyles({
    error: {
      color: theme.palette.error.main,
    },
  }),
);

/**
 * Modal which shows the versions of the front- and backend.
 */
export const Versions: FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const {t} = useTranslation();
  const [backendVersions, setBackendVersions] = useState<BackendVersions>();
  const [error, setError] = useState<string>();
  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    setLoading(true);
    const f = async () => {
      try {
        const versionsResponse = await getVersions();
        setBackendVersions(versionsResponse.data);
      } catch (e) {
        setError(t('versions.error'));
      }

      setLoading(false);
    };

    f();
  }, [setBackendVersions]);

  return (
    <Dialog open={true}>
      <CloseableDialogTitle close={() => dispatch(closeModal())}>
        {t('versions.title')}
      </CloseableDialogTitle>
      <DialogContent>
        <Typography>
          <b>
            {t('versions.frontend')}:{' '}
          </b>
          {config.frontend}
        </Typography>
        {
          loading && error === undefined ?
            <CircularProgress size='2rem'/>:
            error === undefined && backendVersions !== undefined ?
              <VisualizeBackendVersions versions={backendVersions} />:
              <Typography className={classes.error}><b>{error}</b></Typography>
        }
      </DialogContent>
    </Dialog>
  );
};

export default Versions;
