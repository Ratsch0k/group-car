import React, {useState} from 'react';
import {
  AutoFullscreenDialog,
  CloseableDialogTitle,
  useModalRouter,
  GroupWithOwner,
} from 'lib';
import {useTranslation} from 'react-i18next';
import {DialogContent} from '@material-ui/core';
import ManageGroup from './ManageGroup';
import {useParams} from 'react-router-dom';
import ManageGroupNoGroupError from './ManageGroupNoGroupError';

export interface ManageGroupDialogProps {
  /**
   * Id of the group. If not provided this
   * component will try to get the parameter `:groupId` from
   * the path. If that's not possible it will show an error
   * message.
   */
  groupId?: number;
}

export const ManageGroupDialog: React.FC<ManageGroupDialogProps> =
(props: ManageGroupDialogProps) => {
  const {t} = useTranslation();
  const {close} = useModalRouter();
  const [title, setTitle] = useState<string>(t('modals.group.manage.title'));

  /**
   * Handler if the group data is loaded.
   * @param group Group data
   */
  const onGroupLoaded = (group: GroupWithOwner) => {
    setTitle(group.name);
  };

  // Get the group id
  let selectedGroupId: number;
  const {groupId: groupIdParam} = useParams();

  if (typeof props.groupId === 'number') {
    selectedGroupId = props.groupId;
  } else {
    // Try to get the groupId from the path
    selectedGroupId = parseInt(groupIdParam);
  }

  let content: JSX.Element;
  if (typeof selectedGroupId !== 'undefined' && !isNaN(selectedGroupId)) {
    content = <ManageGroup
      groupId={selectedGroupId}
      onGroupLoaded={onGroupLoaded}
    />;
  } else {
    content = <ManageGroupNoGroupError />;
  }

  return (
    <AutoFullscreenDialog open={true} breakpoint='sm'>
      <CloseableDialogTitle close={close}>
        {title}
      </CloseableDialogTitle>
      <DialogContent>
        {content}
      </DialogContent>
    </AutoFullscreenDialog>
  );
};

export default ManageGroupDialog;
