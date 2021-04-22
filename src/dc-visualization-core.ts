/**
 * @module dc-visualization-sdk
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

import { Visualization, ClientConnectionConfig, Context } from './connection';

import {
  Device,
  DeviceChangeDispose,
  DeviceChangeHandler,
  DeviceModel,
} from './device';

interface DcVisualizationStatic extends Context {
  form: Form;
  locale: Locale;
  settings: Settings;
  device: Device;
  deliveryKey: DeliveryKey;
}

const init = async (
  options: Partial<ClientConnectionConfig> = {}
): Promise<DcVisualizationStatic> => {
  const visualization = Visualization.create(options);

  const form = new Form(visualization.connection);
  const locale = new Locale(visualization.connection);
  const settings = new Settings(visualization.connection);
  const deliveryKey = new DeliveryKey(visualization.connection);
  const device = new Device(visualization.connection);

  await visualization.init();

  const context = await visualization.context();

  return {
    form,
    locale,
    settings,
    device,
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
  DeviceChangeDispose,
  DeviceChangeHandler,
  DeviceModel,
};

export * from './interfaces/cd1-response';
export * from './interfaces/cd2-response';
export * from './interfaces/settings';
export * from './interfaces/form-handler';
