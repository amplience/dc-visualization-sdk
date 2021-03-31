import { ClientConnection } from 'message-event-channel'
import { HandlerContainer, HandlerContainerFactory } from './handler-container'

export const KEY = 'visualisation-sdk:delivery-key'

export enum DELIVERY_KEY_EVENTS {
  GET = 'visualisation-sdk:delivery-key:get',
  CHANGE = 'visualisation-sdk:delivery-key:change',
}

export type DeliveryKeyModel = string

export type DeliveryKeyChangeHandler = (deliveryKey: DeliveryKeyModel) => void
export type DeliveryKeyChangeDispose = () => void

export class DeliveryKey {
  public changeHandlerContainer: HandlerContainer<DeliveryKeyChangeHandler>

  constructor(public connection: ClientConnection) {
    const handlerContainer = HandlerContainerFactory(connection)

    this.changeHandlerContainer = handlerContainer<DeliveryKeyChangeHandler>()

    this.connection.on(
      DELIVERY_KEY_EVENTS.CHANGE,
      (deliveryKey: DeliveryKeyModel) => {
        this.changeHandlerContainer.run(deliveryKey)
      }
    )
  }

  get(): Promise<DeliveryKeyModel> {
    return this.connection.request(DELIVERY_KEY_EVENTS.GET)
  }

  changed(cb: DeliveryKeyChangeHandler): DeliveryKeyChangeDispose {
    return this.changeHandlerContainer.add(cb)
  }
}
