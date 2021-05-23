import ReduxError from './ReduxError';

/**
 * Generic error if an error occurred while trying to park a car.
 */
export class CouldNotParkCarError extends ReduxError {
  /**
   * Creates an instance of this error.
   */
  constructor() {
    super('CouldNotParkCarError', 'Couldn\'t park car');
  }
}

export default CouldNotParkCarError;
