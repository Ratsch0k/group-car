import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {translationArrayToJsx} from 'util/i18nextUtil';

const PrivacyPolicy: React.FunctionComponent = () => {
  const {t} = useTranslation();

  return (
    <>
      {translationArrayToJsx(t('privacyPolicy.content', {returnObjects: true}))}
    </>
  );
};

export default PrivacyPolicy;
