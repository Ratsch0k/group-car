import ReduxError from './ReduxError';

/**
 * Error thrown if the user tries to make
 * an action which requires a group to be selected.
 */
export class NoGroupSelectedError extends ReduxError {
  /**
   * Creates an instance of this class.
   */
  constructor() {
    super('NoGroupSelectedError', 'A group has to be selected');
  }
}

export default NoGroupSelectedError;
