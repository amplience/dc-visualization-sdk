import { ClientConnection } from 'message-event-channel';
import { HandlerContainer, HandlerContainerFactory } from './handler-container';

export const KEY = 'visualization-sdk:locale';

export enum LOCALE_EVENTS {
  GET = 'visualization-sdk:locale:get',
  CHANGE = 'visualization-sdk:locale:change',
}

export type LocaleModel = string | null;

export type LocaleChangeHandler = (locale: LocaleModel) => void;
export type LocaleChangeDispose = () => void;

/**
 * Locale class allows you to get the currently selected locale in the form and watch for changes to asynchronously update your application
 */
export class Locale {
  public changeHandlerContainer: HandlerContainer<LocaleChangeHandler>;

  constructor(public connection: ClientConnection) {
    const handlerContainer = HandlerContainerFactory(connection);

    this.changeHandlerContainer = handlerContainer<LocaleChangeHandler>();

    this.connection.on(LOCALE_EVENTS.CHANGE, (locale: LocaleModel) => {
      this.changeHandlerContainer.run(locale);
    });
  }

  /**
   * Get the current locale selected in visualization settings
   *
   * ### Example
   *
   * ```typescript
   * const value = await visualization.locale.get();
   *
   * console.log(value)
   * ```
   */
  get(): Promise<LocaleModel> {
    return this.connection.request(LOCALE_EVENTS.GET);
  }

  /**
   * Sets up a listener for when the visualization locale changes.
   *
   * @param cb - callback function to be called when the visualization locale changes.
   *
   * @returns a dispose function which removes the listener
   *
   * ### Example
   *
   * ```typescript
   *  const dispose = visualization.locale.changed((model) => {
   *    // handle locale change
   *  })
   * ```
   */
  changed(cb: LocaleChangeHandler): LocaleChangeDispose {
    return this.changeHandlerContainer.add(cb);
  }
}
