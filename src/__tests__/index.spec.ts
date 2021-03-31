import visualisation from '../dc-visualization-core'

import { Form } from '../form'
import { Locale } from '../locale'
import { Settings } from '../settings'
import { DeliveryKey } from '../delivery-key'
import { Visualization } from '../connection'
import { ClientConnection, MC_EVENTS } from 'message-event-channel'

describe('core smoke test', () => {
  describe('init', () => {
    it('should be instance of Promise', () => {
      const connected = visualisation.init()

      expect(connected).toBeInstanceOf(Promise)
    })

    it('should be instance of Vis', () => {
      expect(Visualization.create()).toBeInstanceOf(Visualization)
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

      expect(connected).toBe(true)
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

      const connected = await vis.init()

      expect(connected).toBe(false)
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
