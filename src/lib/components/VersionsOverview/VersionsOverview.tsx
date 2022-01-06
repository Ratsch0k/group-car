import React, {FC, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  CircularProgress,
  createStyles,
  makeStyles,
  Typography,
} from '@material-ui/core';
import {GroupCarTheme} from '../../theme';
import {getVersions} from '../../api/getVersions';
import {BackendVersions} from 'lib';
import config from '../../../config';
import BackendVersionsOverview from './BackendVersionsOverview';

const useStyles = makeStyles((theme: GroupCarTheme) =>
  createStyles({
    error: {
      color: theme.palette.error.main,
    },
  }),
);


export const VersionsOverview: FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const {t} = useTranslation();
  const [backendVersions, setBackendVersions] = useState<BackendVersions>();
  const [error, setError] = useState<string>();
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
    <>
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
            <BackendVersionsOverview versions={backendVersions} />:
            <Typography className={classes.error}><b>{error}</b></Typography>
      }
    </>
  );
};

export default VersionsOverview;
