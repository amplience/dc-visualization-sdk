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

import { Visualization, ERRORS_INIT } from './connection'

/** @internal */
const visualisation = Visualization.create()

const form = new Form(visualisation.connection)
const locale = new Locale(visualisation.connection)
const settings = new Settings(visualisation.connection)
const deliveryKey = new DeliveryKey(visualisation.connection)

const init = async () => {
  await visualisation.init()

  return {
    form,
    locale,
    settings,
    deliveryKey,
  }
}

export default { init, form, locale, settings, deliveryKey }

export {
  visualisation,
  form,
  locale,
  settings,
  deliveryKey,
  init,
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
  ERRORS_INIT,
}

export * from './interfaces/cd1-response'
export * from './interfaces/cd2-response'
export * from './interfaces/settings'
export * from './interfaces/form-handler'
