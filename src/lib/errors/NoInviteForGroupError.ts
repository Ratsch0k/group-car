import ReduxError from './ReduxError';

/**
 * Error thrown if user tries to access an invite which doesn't exist.
 */
export class NoInviteForGroupError extends ReduxError {
  /**
   * Creates an instance of this class.
   * @param groupId The id of the group for which no invite exists.
   */
  constructor(groupId: number) {
    super('NoInviteForGroupError', `You're not invited to group ${groupId}`);
  }
}
