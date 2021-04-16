import {List} from '@material-ui/core';
import {useAppSelector} from 'lib/redux/hooks';
import {getUser} from 'lib/redux/slices/auth';
import {getSelectedGroup} from 'lib/redux/slices/group';
import React from 'react';
import {
  ManageGroupMemberListInvitedItem,
} from './ManageGroupMemberListInvitedItem';
import ManageGroupMemberListItem from './ManageGroupMemberListItem';

/**
 * Lists all members and their roles of the specified group.
 * @param props Props
 */
export const ManageGroupMemberList: React.FunctionComponent = () => {
  const user = useAppSelector(getUser);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const group = useAppSelector(getSelectedGroup)!;

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
          last={group.members.length + group.invites.length === 1}
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
            last={index === group.members.length + group.invites.length - 1}
            group={group}
          />,
        )}
      {group.invites.map((invite, index) =>
        <ManageGroupMemberListInvitedItem
          invitedData={invite}
          key={`invited-${invite.userId}`}
          last={index === group.invites.length - 1}
        />,
      )}
    </List>
  );
};

export default ManageGroupMemberList;
