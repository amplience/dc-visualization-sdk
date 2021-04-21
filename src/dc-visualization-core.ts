/**
 * @module dc-visualisation-sdk
 */

import { Form, OnChangeHandler } from './form';

import { Locale, LocaleChangeDispose, LocaleModel } from './locale';

import {
  Settings,
  SettingsChangeDispose,
  SettingsChangeHandler,
  SettingsModel,
} from './settings';

import {
  DeliveryKey,
  DeliveryKeyChangeDispose,
  DeliveryKeyChangeHandler,
  DeliveryKeyModel,
} from './delivery-key';

import {
  Visualization,
  CONNECTION_ERRORS,
  ClientConnectionConfig,
  CONNECTION_EVENTS,
  Context,
} from './connection';

interface DcVisualizationStatic extends Context {
  form: Form;
  locale: Locale;
  settings: Settings;
  deliveryKey: DeliveryKey;
}

const init = async (
  options: Partial<ClientConnectionConfig> = {}
): Promise<DcVisualizationStatic> => {
  const visualisation = Visualization.create(options);

  const form = new Form(visualisation.connection);
  const locale = new Locale(visualisation.connection);
  const settings = new Settings(visualisation.connection);
  const deliveryKey = new DeliveryKey(visualisation.connection);

  await visualisation.init();

  const context = await visualisation.context();

  return {
    form,
    locale,
    settings,
    deliveryKey,
    ...context,
  };
};

export default { init };

export {
  init,
  DcVisualizationStatic,
  OnChangeHandler,
  LocaleChangeDispose,
  LocaleModel,
  SettingsChangeDispose,
  SettingsChangeHandler,
  SettingsModel,
  DeliveryKeyChangeDispose,
  DeliveryKeyChangeHandler,
  DeliveryKeyModel,
};

export * from './interfaces/cd1-response';
export * from './interfaces/cd2-response';
export * from './interfaces/settings';
export * from './interfaces/form-handler';
