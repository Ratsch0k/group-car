import {
  Chip,
  ListItem,
  ListItemAvatar,
  ListItemProps,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from '@material-ui/core';
import {withStyles} from '@material-ui/styles';
import {GroupWithOwnerAndMembersAndInvites, Member, useAuth} from 'lib';
import UserAvatar from 'lib/components/UserAvatar';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {isAdmin as checkIfAdmin} from 'lib/util';
import ManageGroupMemberListItemOptions from
  './ManageGroupMemberListItemOptions';

/**
 * Props for a member list tile.
 */
export interface ManageGroupMemberListItemProps extends ListItemProps {
  /**
   * Data of the member.
   */
  memberData: Member;
  /**
   * Whether or not the member is the owner.
   */
  isOwner?: boolean;
  /**
   * Whether or not this is the last list item. Won't render the divider.
   */
  last?: boolean;
  /**
   * Whether or not this item is the currently logged in user.
   * The username is replaced by the translation for `you`.
   */
  isCurrentUser?: boolean;
  /**
   * The shown group.
   */
  group: GroupWithOwnerAndMembersAndInvites;
}

/**
 * Variant of Chip.
 */
const RoleChip = withStyles({
  sizeSmall: {
    height: 20,
    fontSize: '0.75rem',
  },
})(Chip);

/**
 * List item for the members list of a group.
 * @param props
 */
export const ManageGroupMemberListItem: React.FC<
ManageGroupMemberListItemProps
> = (props: ManageGroupMemberListItemProps) => {
  const {t} = useTranslation();
  const {memberData, isOwner, last, isCurrentUser, group, ...rest} = props;
  const {user} = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(memberData.isAdmin);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsAdmin(memberData.isAdmin);
  }, [memberData.isAdmin]);

  return (
    <ListItem
      divider={!last}
      disabled={loading}
      {...rest as unknown}
    >
      <ListItemAvatar>
        <UserAvatar userId={memberData.User.id}/>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography>
            {
              isCurrentUser ?
              t('misc.you') :
              memberData.User.username
            }
          </Typography>
        }
        secondary={
          <span>
            {
              isOwner &&
              <RoleChip
                variant='outlined'
                size='small'
                color='primary'
                style={{marginRight: memberData.isAdmin ? 4 : undefined}}
                label={t('misc.owner')}/>
            }
            {
              isAdmin &&
              <RoleChip
                variant='outlined'
                size='small'
                color='secondary'
                label={t('misc.admin')}/>
            }
          </span>}
        disableTypography
      />
      {
        !isOwner &&
        !isCurrentUser &&
        (
          (
            checkIfAdmin(group, user?.id) &&
            !memberData.isAdmin
          ) ||
          group.ownerId === user?.id
        ) &&
        <ListItemSecondaryAction>
          <ManageGroupMemberListItemOptions
            group={group}
            memberData={memberData}
            setIsAdmin={setIsAdmin}
            setLoading={setLoading}
          />
        </ListItemSecondaryAction>
      }
    </ListItem>
  );
};

export default ManageGroupMemberListItem;
