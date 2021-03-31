import { ClientConnection } from 'message-event-channel'
import { Settings } from '../settings'

describe('Settings', () => {
  describe('get', () => {
    it('should call connection with get key and return string', async () => {
      const on = jest.fn()
      const request = jest.fn(() => ({ hub: '123' }))

      const connection = ({
        on,
        request,
      } as never) as ClientConnection

      const settings = new Settings(connection)
      const result = await settings.get()

      expect(connection.request).toBeCalledWith(
        'visualisation-sdk:settings:get'
      )
      expect(result).toEqual({ hub: '123' })
    })
  })

  describe('changed', () => {
    it('should add handlers to call later', () => {
      // tslint:disable-next-line
      let run: Function = () => {}
      const on = jest.fn((key, _run) => {
        run = _run
      })
      const emit = jest.fn()

      const connection = ({
        on,
        emit,
      } as never) as ClientConnection

      const handler1 = jest.fn()
      const handler2 = jest.fn()
      const settings = new Settings(connection)

      const dispose1 = settings.changed(handler1)
      const dispose2 = settings.changed(handler2)

      expect(
        settings.changeHandlerContainer.changeHandlers.get(
          '323217f643c3e3f1fe7532e72ac01bb0748c97be'
        )?.size
      ).toEqual(2)

      run({ hub: '123' })

      expect(handler1).toBeCalledWith({ hub: '123' })
      expect(handler2).toBeCalledWith({ hub: '123' })

      run({ hub: '123' })

      expect(handler1).toBeCalledWith({ hub: '123' })
      expect(handler2).toBeCalledWith({ hub: '123' })

      expect(connection.emit).not.toBeCalled()

      dispose1()
      dispose2()

      expect(
        settings.changeHandlerContainer.changeHandlers.get(
          '323217f643c3e3f1fe7532e72ac01bb0748c97be'
        )?.size
      ).toEqual(0)
    })
  })
})
