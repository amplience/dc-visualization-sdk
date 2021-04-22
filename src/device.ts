import { ClientConnection } from 'message-event-channel';
import { HandlerContainer, HandlerContainerFactory } from './handler-container';
import { IDevice } from './interfaces/settings';

export const KEY = 'visualization-sdk:device';

export enum DEVICE_EVENTS {
  GET = 'visualization-sdk:device:get',
  CHANGE = 'visualization-sdk:device:change',
}

export type DeviceModel = IDevice;

export type DeviceChangeHandler = (device: DeviceModel) => void;
export type DeviceChangeDispose = () => void;

/**
 * Device class allows you to get the currently selected device in the form and watch for changes to asynchronously update your application
 */
export class Device {
  public changeHandlerContainer: HandlerContainer<DeviceChangeHandler>;

  constructor(public connection: ClientConnection) {
    const handlerContainer = HandlerContainerFactory(connection);

    this.changeHandlerContainer = handlerContainer<DeviceChangeHandler>();

    this.connection.on(DEVICE_EVENTS.CHANGE, (device: DeviceModel) => {
      this.changeHandlerContainer.run(device);
    });
  }

  /**
   * Get the current device selected
   *
   * ### Example
   *
   * ```typescript
   * const value = await visualization.device.get();
   *
   * console.log(value)
   * ```
   */
  get(): Promise<DeviceModel> {
    return this.connection.request(DEVICE_EVENTS.GET);
  }

  /**
   * Sets up a listener for when the visualization device changes.
   *
   * @param cb - callback function to be called when the visualization device changes.
   *
   * @returns a dispose function which removes the listener
   *
   * ### Example
   *
   * ```typescript
   *  const dispose = visualization.device.changed((model) => {
   *    // handle device change
   *  })
   * ```
   */
  changed(cb: DeviceChangeHandler): DeviceChangeDispose {
    return this.changeHandlerContainer.add(cb);
  }
}
