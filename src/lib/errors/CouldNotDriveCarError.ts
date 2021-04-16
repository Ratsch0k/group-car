/**
 * Generic error thrown if a local error occurred while trying to drive a car.
 */
export class CouldNotDriveCarError extends Error {
  /**
   * Create instance of error.
   */
  constructor() {
    super('Couldn\'t drive car');
  }
}

export default CouldNotDriveCarError;
