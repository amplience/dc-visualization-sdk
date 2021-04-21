let _init: any;

jest.mock('../connection', () => ({
  __esModule: true,

  Visualization: class {
    static create(options: any) {
      return {
        connection: {
          on: jest.fn(),
          init: jest.fn(),
        },
        init: () => _init(options),
        async context() {
          return Promise.resolve({});
        },
      };
    }
  },
}));

import {
  init,
  Form,
  Locale,
  Settings,
  DeliveryKey,
  FORM_EVENTS,
  LOCALE_EVENTS,
  SETTINGS_EVENTS,
  DELIVERY_KEY_EVENTS,
} from '../dc-visualization-core';

describe('core smoke test', () => {
  beforeEach(() => {
    _init = jest.fn().mockImplementation(() => Promise.resolve());
  });
  afterEach(() => {
    jest.resetModules();
  });
  describe('init', () => {
    it('should be instance of Promise', async () => {
      const connected = init();

      expect(connected).toBeInstanceOf(Promise);

      const sdk = await connected;

      expect(sdk.form).toBeInstanceOf(Form);
      expect(sdk.settings).toBeInstanceOf(Settings);
      expect(sdk.deliveryKey).toBeInstanceOf(DeliveryKey);
      expect(sdk.locale).toBeInstanceOf(Locale);
    });

    it('should pass options to Visualization', () => {
      const connected = init({ timeout: true });

      expect(_init).toHaveBeenCalledWith({ timeout: true });
    });

    it('event keys should be present', () => {
      expect(FORM_EVENTS).toBeTruthy();
      expect(LOCALE_EVENTS).toBeTruthy();
      expect(SETTINGS_EVENTS).toBeTruthy();
      expect(DELIVERY_KEY_EVENTS).toBeTruthy();
    });
  });
});
