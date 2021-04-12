import {GroupWithOwnerAndMembersAndInvites} from 'lib';

/**
 * Returns whether or not the specified user is an admin of the specified group.
 * @param group   The group
 * @param userId  The id of the user
 */
export const isAdmin = (
  group: GroupWithOwnerAndMembersAndInvites,
  userId?: number,
): boolean => {
  if (userId === undefined) {
    return false;
  }

  const memberWithId = group.members.find(
    (member) => member.User.id === userId);

  return memberWithId ? memberWithId.isAdmin : false;
};
