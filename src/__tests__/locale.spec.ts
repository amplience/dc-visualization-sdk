import { ClientConnection } from 'message-event-channel'
import { Locale } from '../locale'

describe('Locale', () => {
  describe('get', () => {
    it('should call connection with get key and return string', async () => {
      const on = jest.fn()
      const request = jest.fn(() => 'en-GB')

      const connection = ({
        on,
        request,
      } as never) as ClientConnection

      const locale = new Locale(connection)
      const result = await locale.get()

      expect(connection.request).toBeCalledWith('visualisation-sdk:locale:get')
      expect(result).toEqual('en-GB')
    })
  })

  describe('changed', () => {
    it('should add handlers to call later', () => {
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
      const locale = new Locale(connection)

      const dispose1 = locale.changed(handler1)
      const dispose2 = locale.changed(handler2)

      expect(
        locale.changeHandlerContainer.changeHandlers.get(
          '323217f643c3e3f1fe7532e72ac01bb0748c97be'
        )?.size
      ).toEqual(2)

      run('en-GB')

      expect(handler1).toBeCalledWith('en-GB')
      expect(handler2).toBeCalledWith('en-GB')

      run('ge-GR')

      expect(handler1).toBeCalledWith('ge-GR')
      expect(handler2).toBeCalledWith('ge-GR')

      expect(connection.emit).not.toBeCalled()

      dispose1()
      dispose2()

      expect(
        locale.changeHandlerContainer.changeHandlers.get(
          '323217f643c3e3f1fe7532e72ac01bb0748c97be'
        )?.size
      ).toEqual(0)
    })
  })
})
