import {List} from '@material-ui/core';
import {
  GroupWithOwnerAndMembersAndInvites,
  InviteWithUserAndInviteSender,
} from 'lib';
import {useAppSelector} from 'lib/redux/hooks';
import {getUser} from 'lib/redux/slices/auth';
import React from 'react';
import {
  ManageGroupMemberListInvitedItem,
} from './ManageGroupMemberListInvitedItem';
import ManageGroupMemberListItem from './ManageGroupMemberListItem';

/**
 * Props for the member list.
 */
export interface ManageGroupMemberListProps {
  /**
   * Data of the group.
   */
  group: GroupWithOwnerAndMembersAndInvites;
  /**
   * List of invites which the user has invited.
   */
  additionalInvites: InviteWithUserAndInviteSender[];
}

/**
 * Lists all members and their roles of the specified group.
 * @param props Props
 */
export const ManageGroupMemberList: React.FC<ManageGroupMemberListProps> =
(props: ManageGroupMemberListProps) => {
  const user = useAppSelector(getUser);
  const {group, additionalInvites} = props;
  const invites = group.invites.concat(additionalInvites);

  return (
    <List>
      {
        user &&
        <ManageGroupMemberListItem
          key={`member-${user?.id}`}
          // User should always be in members list
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          memberData={group.members.find((member) =>
            member.User.id === user.id)!}
          last={group.members.length + invites.length === 1}
          isCurrentUser={true}
          isOwner={group.ownerId === user.id}
          group={group}
        />
      }
      {group.members
        .filter((member) => member.User.id !== user?.id)
        .map((member, index) =>
          <ManageGroupMemberListItem
            key={`member-${member.User.id}`}
            memberData={member}
            isOwner={group.ownerId === member.User.id}
            last={index === group.members.length + invites.length - 1}
            group={group}
          />,
        )}
      {invites.map((invite, index) =>
        <ManageGroupMemberListInvitedItem
          invitedData={invite}
          key={`invited-${invite.userId}`}
          last={index === invites.length - 1}
        />,
      )}
    </List>
  );
};

export default ManageGroupMemberList;
