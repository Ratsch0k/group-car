import {List} from '@material-ui/core';
import {
  AuthContext,
  GroupWithOwnerAndMembersAndInvites,
  InviteWithUserAndInviteSender,
} from 'lib';
import React, {useContext} from 'react';
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
  const {user} = useContext(AuthContext);
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
          last={group.members.length === 1}
          isCurrentUser={true}
          isOwner={group.ownerId === user.id}
        />
      }
      {group.members
          .filter((member) => member.User.id !== user?.id)
          .map((member, index) =>
            <ManageGroupMemberListItem
              key={`member-${member.User.id}`}
              memberData={member}
              isOwner={group.ownerId === member.User.id}
              last={index === group.members.length + group.invites.length - 1}
            />,
          )}
      {invites.map((invite, index) =>
        <ManageGroupMemberListInvitedItem
          invitedData={invite}
          key={`invited-${invite.userId}`}
          last={index === group.members.length + group.invites.length - 1}
        />,
      )}
    </List>
  );
};

export default ManageGroupMemberList;
