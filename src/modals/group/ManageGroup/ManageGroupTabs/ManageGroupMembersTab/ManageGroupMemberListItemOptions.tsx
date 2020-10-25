import {IconButton, Menu, MenuItem} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {
  GroupWithOwnerAndMembersAndInvites,
  Member,
  useApi,
  useGroups,
} from 'lib';
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

  /**
   * Callback to set whether or not this member is shown as admin.
   * @param value Value to set isAdmin to
   */
  setIsAdmin(value: boolean): void;

  /**
   * Callback to indicate that this list item is loading.
   * @param value Value of loading
   */
  setLoading(value: boolean): void;
}

/**
 * Options button and menu for a member list item.
 */
export const ManageGroupMemberListItemOptions:
React.FC<ManageGroupMemberListItemOptionsProps> =
(props: ManageGroupMemberListItemOptionsProps) => {
  const [anchorRef, setAnchorRef] = useState<HTMLElement>();
  const {memberData, group, setLoading: parentSetLoading, setIsAdmin} = props;
  const {update} = useGroups();
  const {grantAdmin} = useApi();
  const {t} = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);

  const handleClick =
  (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorRef(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorRef(undefined);
  };

  const handleGrantAdmin = async () => {
    try {
      parentSetLoading(true);
      setLoading(true);
      await grantAdmin(group.id, memberData.User.id);
      await update();
      setIsAdmin(true);
      setAnchorRef(undefined);
    } finally {
      parentSetLoading(false);
      setLoading(false);
    }
  };


  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        open={Boolean(anchorRef)}
        keepMounted
        anchorEl={anchorRef}
        onClose={handleClose}
      >
        {
          !memberData.isAdmin &&
          <MenuItem
            onClick={handleGrantAdmin}
            disabled={loading}
          >
            {t('modals.group.manage.tabs.members.options.grantAdmin')}
          </MenuItem>
        }
      </Menu>
    </>
  );
};

export default ManageGroupMemberListItemOptions;
