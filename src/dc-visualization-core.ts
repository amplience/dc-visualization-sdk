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

import { Visualization, ClientConnectionConfig } from './connection';

import {
  Device,
  DeviceChangeDispose,
  DeviceChangeHandler,
  DeviceModel,
} from './device';

import {
  Context,
  ContextChangeDispose,
  ContextChangeHandler,
  ContextModel,
} from './context';

interface DcVisualizationStatic {
  form: Form;
  locale: Locale;
  settings: Settings;
  device: Device;
  context: Context;
}

const init = async (
  options: Partial<ClientConnectionConfig> = {}
): Promise<DcVisualizationStatic> => {
  const visualization = Visualization.create(options);

  const form = new Form(visualization.connection);
  const locale = new Locale(visualization.connection);
  const settings = new Settings(visualization.connection);
  const device = new Device(visualization.connection);
  const context = new Context(visualization.connection);

  await visualization.init();

  return {
    form,
    locale,
    settings,
    device,
    context,
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
  ContextChangeDispose,
  ContextModel,
  ContextChangeHandler,
  DeviceChangeDispose,
  DeviceChangeHandler,
  DeviceModel,
};

export * from './interfaces/cd1-response';
export * from './interfaces/cd2-response';
export * from './interfaces/settings';
export * from './interfaces/form-handler';
