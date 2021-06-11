import { ClientConnection } from 'message-event-channel';
import { CDv2Response } from './interfaces/cd2-response';
import { HandlerContainer, HandlerContainerFactory } from './handler-container';

import {
  IModel,
  ModelChangeDispose,
  ModelChangeHandler,
} from './interfaces/form-handler';

import {
  DeliveryRequestConfig,
  RequestConfigContainer,
} from './request-config';

export const KEY = 'visualization-sdk:dc-form';

export enum FORM_EVENTS {
  GET = 'visualization-sdk:form:get',
  CHANGE = 'visualization-sdk:form:change',
  SAVED = 'visualization-sdk:form:saved',
  CHANGED_CONFIG = 'visualization-sdk:form:changed-config',
  SAVED_CONFIG = 'visualization-sdk:form:saved-config',
}

export interface OnChangeHandler<Body = any> {
  model: IModel<Body>;
  handlerId: string;
}

/**
 * Form class allows you to watch for changes within the content form, it is not enabled for other contexts such as SnapshotBrowser or Edition page ect.
 */
export class Form {
  /** @internal */
  public changeHandlerContainer: HandlerContainer<
    ModelChangeHandler,
    Partial<DeliveryRequestConfig>
  >;
  /** @internal */
  public savedHandlerContainer: HandlerContainer<
    ModelChangeHandler,
    Partial<DeliveryRequestConfig>
  >;
  constructor(public connection: ClientConnection) {
    const handlerContainer = HandlerContainerFactory(connection);

    this.changeHandlerContainer = handlerContainer<
      ModelChangeHandler,
      Partial<DeliveryRequestConfig>
    >(FORM_EVENTS.CHANGED_CONFIG);
    this.savedHandlerContainer = handlerContainer<
      ModelChangeHandler,
      Partial<DeliveryRequestConfig>
    >(FORM_EVENTS.SAVED_CONFIG);

    this.connection.on(
      FORM_EVENTS.CHANGE,
      ({ model, handlerId }: OnChangeHandler) => {
        this.changeHandlerContainer.run<IModel>(model, handlerId);
      }
    );

    this.connection.on(
      FORM_EVENTS.SAVED,
      ({ model, handlerId }: OnChangeHandler) => {
        this.savedHandlerContainer.run<IModel>(model, handlerId);
      }
    );
  }

  /**
   * Get the current model state of all the fields in the form in Delivery Format.
   *
   * @param config - Config for how the model should be returned e.g CDv2 or CDv1
   *
   * ### Example
   * ```typescript
   * try {
   *   const value = await visualization.form.get();
   *
   *   console.log(value)
   * } catch (e) {
   *   // In a context where there is no form model
   * }
   * ```
   */
  async get<Body = CDv2Response>(config: Partial<DeliveryRequestConfig> = {}) {
    const { config: _config } = new RequestConfigContainer(config);
    const model = await this.connection.request<Body>(FORM_EVENTS.GET, _config);

    return model;
  }

  /**
   * Sets up a listener for when the form saves
   *
   * @param cb - callback function to be called when form has saved
   * @param config - Config for how the model should be returned e.g CDv2 or CDv1
   *
   * @returns a dispose function which removes the listener
   *
   * ### Example
   *
   * ```typescript
   *  const dispose = visualization.form.saved((model) => {
   *    // handle form saved
   *  })
   * ```
   */
  saved<Body = CDv2Response>(
    cb: ModelChangeHandler<Body>,
    config: Partial<DeliveryRequestConfig> = {}
  ): ModelChangeDispose {
    const { config: _config } = new RequestConfigContainer(config);

    return this.savedHandlerContainer.add(cb, _config);
  }

  /**
   * Sets up a listener for when the form changes
   *
   * @param cb - callback function to be called when form has changed
   * @param config - Config for how the model should be returned e.g CDv2 or CDv1
   *
   * @returns a dispose function which removes the listener
   *
   * ### Example
   *
   * ```typescript
   *  const dispose = visualization.form.changed((model) => {
   *    // handle form change
   *  })
   * ```
   */
  changed<Body = CDv2Response>(
    cb: ModelChangeHandler<Body>,
    config: Partial<DeliveryRequestConfig> = {}
  ): ModelChangeDispose {
    const { config: _config } = new RequestConfigContainer(config);

    return this.changeHandlerContainer.add(cb, _config);
  }
}
