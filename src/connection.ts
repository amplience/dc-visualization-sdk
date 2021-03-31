import { ClientConnection, MC_EVENTS } from 'message-event-channel'

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

  async init(): Promise<boolean> {
    this.connection.init()

    return new Promise((resolve, reject) => {
      this.connection.on(MC_EVENTS.CONNECTED, () => resolve(true))
      this.connection.on(MC_EVENTS.CONNECTION_TIMEOUT, () => resolve(false))
    })
  }
}
