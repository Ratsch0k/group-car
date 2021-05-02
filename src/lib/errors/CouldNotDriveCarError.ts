import ReduxError from './ReduxError';

/**
 * Generic error thrown if a local error occurred while trying to drive a car.
 */
export class CouldNotDriveCarError extends ReduxError {
  /**
   * Create instance of error.
   */
  constructor() {
    super('CouldNotDriveCarError', 'Couldn\'t drive car');
  }
}

export default CouldNotDriveCarError;
