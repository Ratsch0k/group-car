import React, {
  ChangeEvent,
  FC,
  useCallback,
  useState,
} from 'react';
import {VersionsOverview} from '../../lib/components/VersionsOverview';
import {
  SettingsTabContent,
  SettingsTabContentProps,
} from '../../lib/components/Settings';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core';
import {useTranslation} from 'react-i18next';

const ChangeLanguage = () => {
  const {i18n, t} = useTranslation();
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback((ev: ChangeEvent<{value: unknown}>) => {
    i18n.changeLanguage(ev.target.value as string).catch((reason) => {
      setError(reason.toString());
    });
  }, [i18n]);

  return (
    <FormControl variant='outlined' id='settings-system-tab-content'>
      <InputLabel
        id='settings-change-lang-label'
      >
        {t('settings.system.language')}
      </InputLabel>
      <Select
        margin='dense'
        value={i18n.language}
        label={t('settings.system.language')}
        onChange={handleChange}
        id='settings-change-lang'
        labelId='settings-change-lang-label'
      >
        {
          i18n.languages.map((language) =>
            <MenuItem value={language} key={`lang-${language}`}>
              {t(`lang.${language}`)}
            </MenuItem>,
          )
        }

      </Select>
      <FormHelperText>{error}</FormHelperText>
    </FormControl>
  );
};

export const AppSettingsTabSystem: FC<SettingsTabContentProps<string>> = (
  props,
) => {
  const {index, value} = props;

  return (
    <SettingsTabContent index={index} value={value}>
      <ChangeLanguage />
      <VersionsOverview />
    </SettingsTabContent>
  );
};

export default AppSettingsTabSystem;
