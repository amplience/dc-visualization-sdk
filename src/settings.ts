import { ClientConnection } from 'message-event-channel'
import { ISettings } from './interfaces/settings'
import { HandlerContainer, HandlerContainerFactory } from './handler-container'

export const KEY = 'visualisation-sdk:settings'

export enum SETTINGS {
  GET = 'visualisation-sdk:settings:get',
  CHANGE = 'visualisation-sdk:settings:change',
}

export type SettingsModel = ISettings

export type SettingsChangeHandler = (settings: SettingsModel) => void
export type SettingsChangeDispose = () => void

export class Settings {
  public changeHandlerContainer: HandlerContainer<SettingsChangeHandler>

  constructor(public connection: ClientConnection) {
    const handlerContainer = HandlerContainerFactory(connection)

    this.changeHandlerContainer = handlerContainer<SettingsChangeHandler>()

    this.connection.on(SETTINGS.CHANGE, (settings: SettingsModel) => {
      this.changeHandlerContainer.run(settings)
    })
  }

  get(): Promise<SettingsModel> {
    return this.connection.request(SETTINGS.GET)
  }

  changed(cb: SettingsChangeHandler): SettingsChangeDispose {
    return this.changeHandlerContainer.add(cb)
  }
}
