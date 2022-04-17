import {IconButton, Menu, MenuItem} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {unwrapResult} from '@reduxjs/toolkit';
import {
  GroupWithOwnerAndMembersAndInvites,
  Member,
  useSnackBar,
} from 'lib';
import {useAppDispatch, useAppSelector} from 'lib/redux/hooks';
import {
  getIsLoading,
  grantAdminRights,
  revokeAdminRights,
} from 'lib/redux/slices/group';
import isRestError from 'lib/util/isRestError';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';

/**
 * Props for member list item props.
 */
export interface ManageGroupMemberListItemOptionsProps {
  /**
   * Data of the group.
   */
  group: GroupWithOwnerAndMembersAndInvites;
  /**
   * Data of the member.
   */
  memberData: Member;
}

/**
 * Options button and menu for a member list item.
 */
export const ManageGroupMemberListItemOptions:
React.FC<ManageGroupMemberListItemOptionsProps> =
(props: ManageGroupMemberListItemOptionsProps) => {
  const [anchorRef, setAnchorRef] = useState<HTMLElement>();
  const {memberData, group} = props;
  const {t} = useTranslation();
  const loading = useAppSelector(getIsLoading);
  const dispatch = useAppDispatch();
  const {show} = useSnackBar();

  const handleClick =
  (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorRef(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorRef(undefined);
  };

  const handleGrantAdmin = async () => {
    try {
      unwrapResult(await dispatch(
        grantAdminRights({groupId: group.id, userId: memberData.User.id})));
      setAnchorRef(undefined);
    } catch (e) {
      if (!isRestError(e)) {
        show('error', (e as Error).message);
      }
    }
  };

  const handleRevokeAdmin = async () => {
    try {
      unwrapResult(await dispatch(
        revokeAdminRights({groupId: group.id, userId: memberData.User.id})));
      setAnchorRef(undefined);
    } catch (e) {
      if (!isRestError(e)) {
        show('error', (e as Error).message);
      }
    }
  };


  return (
    <>
      <IconButton
        onClick={handleClick}
        id={`member-${group.id}-${memberData.User.id}-options-button`}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        open={Boolean(anchorRef)}
        keepMounted
        anchorEl={anchorRef}
        onClose={handleClose}
        anchorOrigin={{horizontal: 'center', vertical: 'top'}}
        transformOrigin={{horizontal: 'center', vertical: 'top'}}
      >
        {
          !memberData.isAdmin ?
            <MenuItem
              onClick={handleGrantAdmin}
              disabled={loading}
            >
              {t('modals.group.manage.tabs.members.options.grantAdmin')}
            </MenuItem>:
            <MenuItem
              onClick={handleRevokeAdmin}
              disabled={loading}
            >
              {t('modals.group.manage.tabs.members.options.revokeAdmin')}
            </MenuItem>
        }
      </Menu>
    </>
  );
};

export default ManageGroupMemberListItemOptions;
