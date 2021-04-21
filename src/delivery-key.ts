import { ClientConnection } from 'message-event-channel';
import { HandlerContainer, HandlerContainerFactory } from './handler-container';

export const KEY = 'visualisation-sdk:delivery-key';

export enum DELIVERY_KEY_EVENTS {
  GET = 'visualisation-sdk:delivery-key:get',
  CHANGE = 'visualisation-sdk:delivery-key:change',
}

export type DeliveryKeyModel = string | null;
export type DeliveryKeyChangeHandler = (deliveryKey: DeliveryKeyModel) => void;
export type DeliveryKeyChangeDispose = () => void;

/**
 * DeliveryKey class allows you to get the delivery key of the content item you're viewing and watch for changes to asynchronously update your application
 */
export class DeliveryKey {
  public changeHandlerContainer: HandlerContainer<DeliveryKeyChangeHandler>;

  constructor(public connection: ClientConnection) {
    const handlerContainer = HandlerContainerFactory(connection);

    this.changeHandlerContainer = handlerContainer<DeliveryKeyChangeHandler>();

    this.connection.on(
      DELIVERY_KEY_EVENTS.CHANGE,
      (deliveryKey: DeliveryKeyModel) => {
        this.changeHandlerContainer.run(deliveryKey);
      }
    );
  }

  /**
   * Get the current delivery key for the content item you're viewing
   *
   * ### Example
   *
   * ```typescript
   * const value = await visualization.deliveryKey.get();
   *
   * console.log(value)
   * ```
   */
  get(): Promise<DeliveryKeyModel> {
    return this.connection.request(DELIVERY_KEY_EVENTS.GET);
  }

  /**
   * Sets up a listener for when the content item delivery key changes.
   *
   * @param cb - callback function to be called when delivery key changes.
   *
   * @returns a dispose function which removes the listener
   *
   * ### Example
   *
   * ```typescript
   *  const dispose = visualization.deliveryKey.changed((model) => {
   *    // handle form change
   *  })
   * ```
   */
  changed(cb: DeliveryKeyChangeHandler): DeliveryKeyChangeDispose {
    return this.changeHandlerContainer.add(cb);
  }
}
