import React, {FC} from 'react';
import {VersionsOverview} from '../../lib/components/VersionsOverview';
import {
  SettingsTabContent,
  SettingsTabContentProps,
} from '../../lib/components/Settings';

export const AppSettingsTabSystem: FC<SettingsTabContentProps<string>> = (
  props,
) => {
  const {index, value} = props;

  return (
    <SettingsTabContent index={index} value={value}>
      <VersionsOverview />
    </SettingsTabContent>
  );
};

export default AppSettingsTabSystem;
