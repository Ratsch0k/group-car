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
      {props.group.members.map((member, index) => {
        return (
          <ManageGroupMemberListItem
            key={`member-${member.User.id}`}
            memberData={member}
            isOwner={props.group.Owner.id === member.User.id}
            last={index === props.group.members.length - 1}
            isCurrentUser={member.User.id === user?.id}
          />
        );
      })}
    </List>
  );
};

export default ManageGroupMemberList;
