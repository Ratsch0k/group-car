import {
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemProps,
  ListItemSecondaryAction,
  ListItemText,
  Theme,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import {
  GroupWithOwnerAndMembersAndInvites,
  Member,
  Chip,
} from 'lib';
import UserAvatar from 'lib/components/UserAvatar';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {isAdmin as checkIfAdmin} from 'lib/util';
import ManageGroupMemberListItemOptions from
  './ManageGroupMemberListItemOptions';
import {useAppSelector, useShallowAppSelector} from 'lib/redux/hooks';
import {getUser} from 'lib/redux/slices/auth/authSelectors';
import {getIsLoading} from 'lib/redux/slices/group';

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
 * List item for the members list of a group.
 * @param props
 */
export const ManageGroupMemberListItem: React.FC<
ManageGroupMemberListItemProps
> = (props: ManageGroupMemberListItemProps) => {
  const {t} = useTranslation();
  const {
    memberData: memberDataProps,
    isOwner,
    last,
    isCurrentUser,
    group,
    ...rest
  } = props;
  const user = useShallowAppSelector(getUser);
  const [memberData, setMemberData] = useState<Member>(memberDataProps);
  const loading = useAppSelector(getIsLoading);
  const smUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));

  useEffect(() => {
    setMemberData(memberDataProps);
  }, [memberDataProps]);

  return (
    <>
      <ListItem
        disabled={loading}
        {...rest as never}
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
              <Chip
                size='small'
                color='primary'
                style={{marginRight: memberData.isAdmin ? 4 : undefined}}
                label={<b>{t('misc.owner')}</b>}/>
              }
              {
                memberData.isAdmin &&
              <Chip
                size='small'
                color='secondary'
                label={<b>{t('misc.admin')}</b>}/>
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
          />
        </ListItemSecondaryAction>
        }
      </ListItem>
      {!last && smUp && <Divider variant='inset'/>}
    </>
  );
};

export default ManageGroupMemberListItem;
