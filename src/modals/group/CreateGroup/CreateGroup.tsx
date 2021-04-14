import React, {useState} from 'react';
import {
  CloseableDialogTitle,
  GroupCarTheme,
} from 'lib';
import {useTranslation} from 'react-i18next';
import {DialogContent, Dialog} from '@material-ui/core';
import CreateGroupForm from './CreateGroupForm';
import {makeStyles, createStyles} from '@material-ui/styles';
import {useAppDispatch} from 'redux/hooks';
import {push} from 'connected-react-router';
import {close} from 'redux/slices/modalRouter/modalRouterSlice';

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
  const {t} = useTranslation();
  const classes = useStyles();
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  /**
   * Handles if the component should navigate to the
   * route for managing the group.
   * @param id id of the group
   */
  const navToGroupManagement = async (id: number) => {
    dispatch(push(`/group/${id}?modal=/group/manage/${id}`));
  };

  /**
   * Handles close action.
   */
  const closeDialog = () => {
    setLoading(false);
    dispatch(close());
  };

  return (
    <Dialog open={true} fullWidth>
      <CloseableDialogTitle close={() => dispatch(close())} disabled={loading}>
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
