import { ClientConnection } from 'message-event-channel'
import { CDv2Response } from './interfaces/cd2-response'
import { HandlerContainer, HandlerContainerFactory } from './handler-container'

import {
  IModel,
  ModelChangeDispose,
  ModelChangeHandler,
} from './interfaces/form.handler'
import { DeliveryRequestConfig, RequestConfigContainer } from './request-config'

export const KEY = 'visualisation-sdk:dc-form'

export enum FORM_EVENTS {
  GET = 'visualisation-sdk:form:get',
  CHANGE = 'visualisation-sdk:form:change',
  SAVED = 'visualisation-sdk:form:saved',
  CHANGED_CONFIG = 'visualisation-sdk:form:changed-config',
  SAVED_CONFIG = 'visualisation-sdk:form:saved-config',
}

interface OnChangeHandler {
  model: IModel<Body>
  handlerId: string
}

export class Form {
  public changeHandlerContainer: HandlerContainer<
    ModelChangeHandler,
    Partial<DeliveryRequestConfig>
  >
  public savedHandlerContainer: HandlerContainer<
    ModelChangeHandler,
    Partial<DeliveryRequestConfig>
  >
  constructor(public connection: ClientConnection) {
    const handlerContainer = HandlerContainerFactory(connection)

    this.changeHandlerContainer = handlerContainer<
      ModelChangeHandler,
      Partial<DeliveryRequestConfig>
    >(FORM_EVENTS.CHANGED_CONFIG)
    this.savedHandlerContainer = handlerContainer<
      ModelChangeHandler,
      Partial<DeliveryRequestConfig>
    >(FORM_EVENTS.SAVED_CONFIG)

    this.connection.on(
      FORM_EVENTS.CHANGE,
      ({ model, handlerId }: OnChangeHandler) => {
        this.changeHandlerContainer.run<IModel<Body>>(model, handlerId)
      }
    )

    this.connection.on(
      FORM_EVENTS.SAVED,
      ({ model, handlerId }: OnChangeHandler) => {
        this.savedHandlerContainer.run<IModel<Body>>(model, handlerId)
      }
    )
  }

  async get(config: Partial<DeliveryRequestConfig> = {}) {
    const model = await this.connection.request(FORM_EVENTS.GET, config)

    return model
  }

  saved<Body = CDv2Response>(
    cb: ModelChangeHandler<Body>,
    config: Partial<DeliveryRequestConfig> = {}
  ): ModelChangeDispose {
    const { config: _config } = new RequestConfigContainer(config)

    return this.savedHandlerContainer.add(cb, _config)
  }

  changed<Body = CDv2Response>(
    cb: ModelChangeHandler<Body>,
    config: Partial<DeliveryRequestConfig> = {}
  ): ModelChangeDispose {
    const { config: _config } = new RequestConfigContainer(config)

    return this.changeHandlerContainer.add(cb, _config)
  }
}
