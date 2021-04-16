/**
 * Generic error if an error occurred while trying to park a car.
 */
export class CouldNotParkCarError extends Error {
  /**
   * Creates an instance of this error.
   */
  constructor() {
    super('Couldn\'t park car');
  }
}

export default CouldNotParkCarError;
