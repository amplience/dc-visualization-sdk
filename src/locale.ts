import { ClientConnection } from 'message-event-channel'
import { HandlerContainer, HandlerContainerFactory } from './handler-container'

export const KEY = 'visualisation-sdk:locale'

export enum LOCALE_EVENTS {
  GET = 'visualisation-sdk:locale:get',
  CHANGE = 'visualisation-sdk:locale:change',
}

export type LocaleModel = string

export type LocaleChangeHandler = (locale: LocaleModel) => void
export type LocaleChangeDispose = () => void

export class Locale {
  public changeHandlerContainer: HandlerContainer<LocaleChangeHandler>

  constructor(public connection: ClientConnection) {
    const handlerContainer = HandlerContainerFactory(connection)

    this.changeHandlerContainer = handlerContainer<LocaleChangeHandler>()

    this.connection.on(LOCALE_EVENTS.CHANGE, (locale: LocaleModel) => {
      this.changeHandlerContainer.run(locale)
    })
  }

  get(): Promise<LocaleModel> {
    return this.connection.request(LOCALE_EVENTS.GET)
  }

  changed(cb: LocaleChangeHandler): LocaleChangeDispose {
    return this.changeHandlerContainer.add(cb)
  }
}
