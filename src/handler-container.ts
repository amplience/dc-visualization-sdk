import hash from 'object-hash'
import { ClientConnection } from 'message-event-channel'

export class HandlerContainer<
  Handler extends (model: any) => void,
  Config = {}
> {
  changeHandlers = new Map<string, Set<Handler>>()

  constructor(
    public event: string | null,
    public connection: ClientConnection
  ) {}

  add(cb: Handler, config?: Config) {
    const id = hash(config || {})

    if (this.changeHandlers.has(id)) {
      const existing = this.changeHandlers.get(id) as Set<Handler>
      const handlers = existing.add(cb)

      this.changeHandlers.set(id, handlers)
    } else {
      this.changeHandlers.set(id, new Set([cb]))

      if (this.event) {
        this.connection.emit(this.event, { id, config })
      }
    }

    return () => {
      const handlers = this.changeHandlers.get(id)

      handlers?.delete(cb)
    }
  }

  run<Model>(model: Model, handlerId: string = hash({})) {
    this.changeHandlers
      .get(handlerId)
      ?.forEach((handler: Handler) => handler(model))
  }
}

export const HandlerContainerFactory = (connection: ClientConnection) => <
  Handler extends (model: any) => void,
  Config = {}
>(
  event: string | null = null
) => new HandlerContainer<Handler, Config>(event, connection)
