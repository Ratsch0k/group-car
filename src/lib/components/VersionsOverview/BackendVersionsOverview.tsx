import React, {FC} from 'react';
import {Typography} from '@material-ui/core';
import {useTranslation} from 'react-i18next';
import {BackendVersions} from 'lib';

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

export default VisualizeBackendVersions;
