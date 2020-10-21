import {red} from '@material-ui/core/colors';
import {makeStyles} from '@material-ui/styles';
import {ProgressButton, useGroups, useModalRouter, useSnackBar} from 'lib';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';

/**
 * Props.
 */
export interface ManageGroupLeaveActionProps {
  groupId: number;
}

/**
 * Styles.
 */
const useStyles = makeStyles({
  button: {
    color: red['700'],
    borderColor: red['700'],
  },
});

/**
 * Button to leave the specified group.
 * @param props Props
 */
export const ManageGroupLeaveAction: React.FC<ManageGroupLeaveActionProps> =
(props: ManageGroupLeaveActionProps) => {
  const {t} = useTranslation();
  const classes = useStyles();
  const {leaveGroup} = useGroups();
  const [loading, setLoading] = useState<boolean>(false);
  const {groupId} = props;
  const {close} = useModalRouter();
  const {show} = useSnackBar();

  const handleClick = async () => {
    setLoading(true);
    try {
      await leaveGroup(groupId);
      setLoading(false);
      show('success', t('modals.group.manage.leaveGroupSuccess'));
      close();
    } catch {
      setLoading(false);
    }
  };

  return (
    <ProgressButton
      variant='outlined'
      className={classes.button}
      fullWidth
      loading={loading}
      onClick={handleClick}
    >
      {t('modals.group.manage.leaveGroup')}
    </ProgressButton>
  );
};

export default ManageGroupLeaveAction;
