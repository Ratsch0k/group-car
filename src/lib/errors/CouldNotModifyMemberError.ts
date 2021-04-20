import ReduxError from './ReduxError';

/**
 * Error thrown if a member could not be modified.
 */
export class CouldNotModifyMemberError extends ReduxError {
  /**
   * Creates an instance of this class.
   */
  constructor() {
    super('CouldNotModifyMemberError', 'Could not modify the member');
  }
}

export default CouldNotModifyMemberError;
