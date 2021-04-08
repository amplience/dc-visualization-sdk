import { ClientConnection, MC_EVENTS } from 'message-event-channel'

export enum ERRORS_INIT {
  /**
   * Extension failed to connect to Dynamic content
   */
  CONNECTION_TIMEOUT = 'Failed to establish connection to DC Application',
}

export class Visualization {
  public connection = new ClientConnection({
    connectionTimeout: false,
    timeout: false,
    debug: false,
  })

  static create() {
    const core = new Visualization()

    return core
  }

  /**
   * The method that starts it all
   *
   * @return Returns a promise that will resolve if the connection was successful
   *
   * ```typescript
   * import visualization from 'dc-visualization-sdk';
   *
   * async function initialize() {
   *  await visualization.init();
   *
   *  //.. setup extension
   * }
   * ```
   */
  async init(): Promise<void> {
    this.connection.init()

    return new Promise((resolve, reject) => {
      this.connection.on(MC_EVENTS.CONNECTED, () => resolve())
      this.connection.on(MC_EVENTS.CONNECTION_TIMEOUT, () =>
        reject(ERRORS_INIT.CONNECTION_TIMEOUT)
      )
    })
  }
}
