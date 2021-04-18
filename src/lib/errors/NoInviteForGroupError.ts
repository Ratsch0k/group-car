/**
 * Error thrown if user tries to access an invite which doesn't exist.
 */
export class NoInviteForGroupError extends Error {
  /**
   * Creates an instance of this class.
   * @param groupId The id of the group for which no invite exists.
   */
  constructor(groupId: number) {
    super(`You're not invited to group ${groupId}`);
  }
}
