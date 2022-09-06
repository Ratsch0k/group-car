/* eslint-disable-next-line */
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types */
import io from 'socket.io-client';

/**
 * Type of an event handler
 */
export type EventHandler = (data: any) => void;

/**
 * Map that associates a list of event handler with an event type
 */
export type HandlerMap = Record<string, EventHandler[]>;

/**
 * Class representing a emulated socket connection and provides
 * used functionalities of the usually used socket.io-client connection.
 */
class Connection {
  private eventHandlers: HandlerMap = {};
  private removeConnection: (connection: Connection) => void;
  public path: string;

  /**
   * Creates a connection
   * @param path Namespace
   * @param removeConnection  Function to remove this connection
   *                          from the SocketWrapper
   */
  constructor(
    path: string, removeConnection: (connection: Connection) => void,
  ) {
    this.path = path;
    this.removeConnection = removeConnection;
  }

  /**
   * Disconnects this connection.
   */
  public disconnect() {
    this.eventHandlers = {};
    this.removeConnection(this);
  }

  /**
   * Emits an event to all event handlers listening to events
   * with the given event name.
   * @param eventName Name of the event
   * @param event Event
   */
  public emit(eventName: string, event: any): void {
    if (this.eventHandlers[eventName] !== undefined) {
      for (const handler of this.eventHandlers[eventName]) {
        handler(event);
      }
    }
  }

  /**
   * Subscribes the handler to all events of eventName
   * @param eventName Event name
   * @param handler Handler called when an event of the evenName is emitted
   */
  public on(eventName: string, handler: EventHandler): void {
    if (this.eventHandlers[eventName] === undefined) {
      this.eventHandlers[eventName] = [];
    }

    this.eventHandlers[eventName].push(handler);
  }

  /**
   * Unsubscribes the given handler from handling events of eventName
   * @param eventName Event name
   * @param handler Handler that should from the handler
   *                handling eventName events
   */
  public off(eventName: string, handler: EventHandler): void {
    if (this.eventHandlers[eventName] !== undefined) {
      for (let i = 0; i < this.eventHandlers[eventName].length; i++) {
        const registeredHandler = this.eventHandlers[eventName][i];
        if (handler === registeredHandler) {
          this.eventHandlers[eventName].splice(i, 1);
        }
      }
    }
  }
}

/**
 * Map associating a list of connection with a namespace.
 */
export type ConnectionMap = Record<string, Connection[]>;

/**
 * Class wrapping sockets to make websocket functional in
 * the demo environment.
 * Not used for now.
 */
class SocketWrapper {
  private static connections: ConnectionMap = {};

  /**
   * Wrap the io.connect function to replace actual connections with
   * emulated ones.
   */
  public static wrap(): void {
    (io.connect as any) = SocketWrapper.createConnection;
  }

  /**
   * Creates a connection for the given namespace and returns it
   * @param path Namespace
   * @param params Unused but allowed additional parameters
   * @returns The created connection
   */
  private static createConnection(
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    path: string, ..._params: any[]
  ): Connection {
    const connection = new Connection(
      path, SocketWrapper.disconnectConnection);

    if (SocketWrapper.connections[path] === undefined) {
      SocketWrapper.connections[path] = [];
    }

    SocketWrapper.connections[path].push(connection);

    return connection;
  }

  /**
   * Emits event of event name to all connection of the given namespace
   * @param path Namespace
   * @param eventName Event name
   * @param event Event
   */
  public static emitEvent(path: string, eventName: string, event: any): void {
    if (SocketWrapper.connections[path] !== undefined) {
      for (const connection of SocketWrapper.connections[path]) {
        connection.emit(eventName, event);
      }
    }
  }

  /**
   * Disconnect the given connection.
   * @param connection The connection to disconnect
   */
  private static disconnectConnection(connection: Connection): void {
    const path = connection.path;

    if (SocketWrapper.connections[path] !== undefined) {
      for (let i = 0; i < SocketWrapper.connections[path].length; i++) {
        const registeredConnection = SocketWrapper.connections[path][i];
        if (registeredConnection === connection) {
          SocketWrapper.connections[path].splice(i, 1);
        }
      }
    }
  }
}


export default SocketWrapper;
