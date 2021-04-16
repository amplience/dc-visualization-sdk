/**
 * @module dc-visualisation-sdk
 */

import { Form, OnChangeHandler, FORM_EVENTS } from './form'

import {
  Locale,
  LOCALE_EVENTS,
  LocaleChangeDispose,
  LocaleModel,
} from './locale'

import {
  Settings,
  SETTINGS_EVENTS,
  SettingsChangeDispose,
  SettingsChangeHandler,
  SettingsModel,
} from './settings'

import {
  DeliveryKey,
  DELIVERY_KEY_EVENTS,
  DeliveryKeyChangeDispose,
  DeliveryKeyChangeHandler,
  DeliveryKeyModel,
} from './delivery-key'

import {
  Visualization,
  CONNECTION_ERRORS,
  ClientConnectionConfig,
  CONNECTION_EVENTS,
  Context,
} from './connection'

interface DcVisualizationStatic {
  form: Form
  locale: Locale
  settings: Settings
  deliveryKey: DeliveryKey
}

const init = async (
  options: Partial<ClientConnectionConfig> = {}
): Promise<DcVisualizationStatic> => {
  const visualisation = Visualization.create(options)

  const form = new Form(visualisation.connection)
  const locale = new Locale(visualisation.connection)
  const settings = new Settings(visualisation.connection)
  const deliveryKey = new DeliveryKey(visualisation.connection)

  await visualisation.init()

  const context = await visualisation.context()

  return {
    form,
    locale,
    settings,
    deliveryKey,
    ...context,
  }
}

export default { init }

export {
  init,
  DcVisualizationStatic,
  Form,
  OnChangeHandler,
  FORM_EVENTS,
  Locale,
  LOCALE_EVENTS,
  LocaleChangeDispose,
  LocaleModel,
  Settings,
  SETTINGS_EVENTS,
  SettingsChangeDispose,
  SettingsChangeHandler,
  SettingsModel,
  DeliveryKey,
  DELIVERY_KEY_EVENTS,
  DeliveryKeyChangeDispose,
  DeliveryKeyChangeHandler,
  DeliveryKeyModel,
  Visualization,
  CONNECTION_ERRORS,
  CONNECTION_EVENTS,
  Context,
}

export * from './interfaces/cd1-response'
export * from './interfaces/cd2-response'
export * from './interfaces/settings'
export * from './interfaces/form-handler'
