import { ClientConnection } from 'message-event-channel';
import { ISettings } from './interfaces/settings';
import { HandlerContainer, HandlerContainerFactory } from './handler-container';

export const KEY = 'visualisation-sdk:settings';

export enum SETTINGS_EVENTS {
  GET = 'visualisation-sdk:settings:get',
  CHANGE = 'visualisation-sdk:settings:change',
}

export type SettingsModel = ISettings;

export type SettingsChangeHandler = (settings: SettingsModel) => void;
export type SettingsChangeDispose = () => void;

/**
 * Settings class allows you to get the currently selected visualization settings in the form such as Device selected, vse URL, contentId and snapshotId and watch for changes to asynchronously update your application
 */
export class Settings {
  public changeHandlerContainer: HandlerContainer<SettingsChangeHandler>;

  constructor(public connection: ClientConnection) {
    const handlerContainer = HandlerContainerFactory(connection);

    this.changeHandlerContainer = handlerContainer<SettingsChangeHandler>();

    this.connection.on(SETTINGS_EVENTS.CHANGE, (settings: SettingsModel) => {
      this.changeHandlerContainer.run(settings);
    });
  }

  /**
   * Get more context into the visualization, such as the vse and viewing device information
   *
   * ### Example
   *
   * ```typescript
   * const value = await visualization.settings.get();
   *
   * console.log(value)
   * ```
   */
  get(): Promise<SettingsModel> {
    return this.connection.request(SETTINGS_EVENTS.GET);
  }

  /**
   * Sets up a listener for when the visualization settings.
   *
   * @param cb - callback function to be called any settings change.
   *
   * @returns a dispose function which removes the listener
   *
   * ### Example
   *
   * ```typescript
   *  const dispose = visualization.settings.changed((model) => {
   *    // handle form change
   *  })
   * ```
   */
  changed(cb: SettingsChangeHandler): SettingsChangeDispose {
    return this.changeHandlerContainer.add(cb);
  }
}
