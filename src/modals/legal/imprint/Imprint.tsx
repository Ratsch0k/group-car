import React from 'react';
import {DialogContent, Dialog} from '@material-ui/core';
import {useTranslation} from 'react-i18next';
import CloseableDialogTitle from 'lib/components/CloseableDialog';
import useModalRouter from 'lib/hooks/useModalRouter';

const Imprint: React.FC = () => {
  const {t} = useTranslation();
  const {close} = useModalRouter();

  return (
    <Dialog open={true}>
      <CloseableDialogTitle close={close}>
        {t('imprint.title')}
      </CloseableDialogTitle>
      <DialogContent>
        <div>
          <h2>Angaben gem&auml;&szlig; &sect; 5 TMG</h2>
          <p>Simon Lukas Kurz<br />
      Am Damsberg, 17a<br />
      55130 Mainz</p>

          <h2>Kontakt</h2>
          <p>Telefon: +49 06131 870926<br />
      Telefax: +49 06131 870919<br />
      E-Mail: mygroupcar@gmail.com</p>

          <p>Quelle: <a href="https://www.e-recht24.de">eRecht24</a></p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Imprint;
