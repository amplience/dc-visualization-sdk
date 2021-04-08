import visualisation, {
  ERRORS_INIT,
  visualisation as conneciton,
  Form,
  Locale,
  Settings,
  DeliveryKey,
  FORM_EVENTS,
  LOCALE_EVENTS,
  SETTINGS_EVENTS,
  DELIVERY_KEY_EVENTS,
} from '../dc-visualization-core'

import { Visualization } from '../connection'
import { ClientConnection, MC_EVENTS } from 'message-event-channel'

describe('core smoke test', () => {
  describe('init', () => {
    it('should be instance of Promise', async () => {
      spyOn(conneciton, 'init').and.returnValue(Promise.resolve())

      const connected = visualisation.init()

      expect(connected).toBeInstanceOf(Promise)

      const sdk = await connected

      expect(sdk.form).toBeInstanceOf(Form)
      expect(sdk.settings).toBeInstanceOf(Settings)
      expect(sdk.deliveryKey).toBeInstanceOf(DeliveryKey)
      expect(sdk.locale).toBeInstanceOf(Locale)
    })

    it('should be instance of Vis', () => {
      expect(Visualization.create()).toBeInstanceOf(Visualization)
    })

    it('event keys should be present', () => {
      expect(FORM_EVENTS).toBeTruthy()
      expect(LOCALE_EVENTS).toBeTruthy()
      expect(SETTINGS_EVENTS).toBeTruthy()
      expect(DELIVERY_KEY_EVENTS).toBeTruthy()
    })

    it('should return true if connected', async () => {
      const vis = Visualization.create()

      const on = jest.fn((key, handler) => {
        if (key === MC_EVENTS.CONNECTED) {
          handler()
        }
      })
      vis.connection = ({
        on,
        // tslint:disable-next-line
        init: () => {},
      } as never) as ClientConnection

      const connected = await vis.init()

      expect(connected).toBe(undefined)
    })

    it('should return false if failed to connect', async () => {
      const vis = Visualization.create()

      const on = jest.fn((key, handler) => {
        if (key === MC_EVENTS.CONNECTION_TIMEOUT) {
          handler()
        }
      })
      vis.connection = ({
        on,
        // tslint:disable-next-line
        init: () => {},
      } as never) as ClientConnection

      try {
        await vis.init()
      } catch (err) {
        expect(err).toBe(ERRORS_INIT.CONNECTION_TIMEOUT)
      }
    })
  })

  describe('form', () => {
    it('should be instance of Form', () => {
      expect(visualisation.form).toBeInstanceOf(Form)
    })

    it('should have a method get', () => {
      expect(visualisation.form.get).toBeInstanceOf(Function)
    })

    it('should have a method changed', () => {
      expect(visualisation.form.changed).toBeInstanceOf(Function)
    })

    it('should have a method saved', () => {
      expect(visualisation.form.saved).toBeInstanceOf(Function)
    })
  })

  describe('locale', () => {
    it('should be instance of Locale', () => {
      expect(visualisation.locale).toBeInstanceOf(Locale)
    })

    it('should have a method get', () => {
      expect(visualisation.locale.get).toBeInstanceOf(Function)
    })

    it('should have a method changed', () => {
      expect(visualisation.locale.changed).toBeInstanceOf(Function)
    })
  })

  describe('deliveryKey', () => {
    it('should be instance of DeliveryKey', () => {
      expect(visualisation.deliveryKey).toBeInstanceOf(DeliveryKey)
    })

    it('should have a method get', () => {
      expect(visualisation.deliveryKey.get).toBeInstanceOf(Function)
    })

    it('should have a method changed', () => {
      expect(visualisation.deliveryKey.changed).toBeInstanceOf(Function)
    })
  })

  describe('settings', () => {
    it('should be instance of Settings', () => {
      expect(visualisation.settings).toBeInstanceOf(Settings)
    })

    it('should have a method get', () => {
      expect(visualisation.settings.get).toBeInstanceOf(Function)
    })

    it('should have a method changed', () => {
      expect(visualisation.settings.changed).toBeInstanceOf(Function)
    })
  })
})
