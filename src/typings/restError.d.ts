/**
 * Represents a rest error returned by the server.
 */
export interface RestError<T = never> {
  statusCode: number;
  status: string;
  message: string;
  timestamp: Date;
  detail?: T;
}
