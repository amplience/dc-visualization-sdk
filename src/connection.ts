import { ClientConnection, MC_EVENTS } from 'message-event-channel'

export enum CONNECTION_ERRORS {
  /**
   * Extension failed to connect to Dynamic content
   */
  CONNECTION_TIMEOUT = 'Failed to establish connection to DC Application',
  NO_CONNECTION = `Connection has not been made yet`,
}

export interface ClientConnectionConfig {
  connectionTimeout: boolean | number
  timeout: boolean | number
  debug: boolean
}

export interface Context {
  contentId: string
  contentTypeId: string
  snapshotId: string | null
}

export enum CONNECTION_EVENTS {
  CONTEXT = 'visualisation-sdk:context:get',
}
export class Visualization {
  public connection!: ClientConnection

  private readonly DEFAULT_OPTIONS = {
    connectionTimeout: false,
    timeout: false,
    debug: false,
  }

  static create(options: Partial<ClientConnectionConfig> = {}) {
    const core = new Visualization(options)

    return core
  }

  constructor(options: Partial<ClientConnectionConfig> = {}) {
    this.connection = new ClientConnection(
      Object.assign({}, this.DEFAULT_OPTIONS, options)
    )
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
  async init(): Promise<true> {
    this.connection.init()

    return new Promise((resolve, reject) => {
      this.connection.on(MC_EVENTS.CONNECTED, () => resolve(true))
      this.connection.on(MC_EVENTS.CONNECTION_TIMEOUT, () =>
        reject(CONNECTION_ERRORS.CONNECTION_TIMEOUT)
      )
    })
  }

  async context() {
    return this.connection.request<Context>(CONNECTION_EVENTS.CONTEXT)
  }
}
