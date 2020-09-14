import {List} from '@material-ui/core';
import {AuthContext, GroupWithOwnerAndMembers} from 'lib';
import React, {useContext} from 'react';
import ManageGroupMemberListItem from './ManageGroupMemberListItem';

export interface ManageGroupMemberListProps {
  group: GroupWithOwnerAndMembers;
}

export const ManageGroupMemberList: React.FC<ManageGroupMemberListProps> =
(props: ManageGroupMemberListProps) => {
  const {user} = useContext(AuthContext);

  return (
    <List>
      {
        user &&
        <ManageGroupMemberListItem
          key={`member-${user?.id}`}
          // User should always be in members list
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          memberData={props.group.members.find((member) =>
            member.User.id === user.id)!}
          last={props.group.members.length === 1}
          isCurrentUser={true}
          isOwner={props.group.ownerId === user.id}
        />
      }
      {props.group.members
          .filter((member) => member.User.id !== user?.id)
          .map((member, index) => {
            return (
              <ManageGroupMemberListItem
                key={`member-${member.User.id}`}
                memberData={member}
                isOwner={props.group.ownerId === member.User.id}
                last={index === props.group.members.length - 1}
              />
            );
          })}
    </List>
  );
};

export default ManageGroupMemberList;
