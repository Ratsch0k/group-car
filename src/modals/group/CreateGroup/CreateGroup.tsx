import React, {useState} from 'react';
import {
  CloseableDialogTitle,
  useModalRouter,
  GroupCarTheme,
} from 'lib';
import {useTranslation} from 'react-i18next';
import {DialogContent, Dialog} from '@material-ui/core';
import CreateGroupForm from './CreateGroupForm';
import {makeStyles, createStyles} from '@material-ui/styles';
import {useHistory} from 'react-router-dom';

/**
 * Styles.
 */
const useStyles = makeStyles((theme: GroupCarTheme) =>
  createStyles({
    content: {
      paddingBottom: theme.spacing(3),
    },
  }),
);

/**
 * Create group dialog.
 */
export const CreateGroup: React.FC = () => {
  const {close} = useModalRouter();
  const {t} = useTranslation();
  const classes = useStyles();
  const [loading, setLoading] = useState<boolean>(false);
  const history = useHistory();

  /**
   * Handles if the component should navigate to the
   * route for managing the group.
   * @param id id of the group
   */
  const navToGroupManagement = async (id: number) => {
    history.push(`/group/${id}?modal=/group/manage/${id}`);
  };

  /**
   * Handles close action.
   */
  const closeDialog = () => {
    setLoading(false);
    close();
  };

  return (
    <Dialog open={true} fullWidth>
      <CloseableDialogTitle close={close} disabled={loading}>
        {t('modals.group.create.title')}
      </CloseableDialogTitle>
      <DialogContent className={classes.content}>
        <CreateGroupForm
          setLoading={setLoading}
          close={closeDialog}
          navigateToManagement={navToGroupManagement}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroup;
