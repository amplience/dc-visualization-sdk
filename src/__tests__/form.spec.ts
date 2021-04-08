import { ClientConnection } from 'message-event-channel'
import { Form } from '../form'

describe('Form', () => {
  describe('get', () => {
    it('should call connection with get key and config passed', async () => {
      const on = jest.fn()
      const request = jest.fn(() => ({ hello: 'world' }))

      const connection = ({
        on,
        request,
      } as never) as ClientConnection

      const form = new Form(connection)
      const result = await form.get({ depth: 'all' })

      expect(connection.request).toBeCalledWith('visualisation-sdk:form:get', {
        depth: 'all',
      })
      expect(result).toEqual({ hello: 'world' })
    })
  })

  describe('saved', () => {
    it('should add handlers to call later', () => {
      let handler
      const on = jest.fn((key, _handler) => {
        handler = _handler
      })
      const emit = jest.fn()

      const connection = ({
        on,
        emit,
      } as never) as ClientConnection

      const form = new Form(connection)

      // tslint:disable-next-line
      const dispose1 = form.saved((model) => {})

      expect(
        form.savedHandlerContainer.changeHandlers.get(
          'f0c61d3970237e725866704d6fa5487d7fce557d'
        )?.size
      ).toBe(1)

      // tslint:disable-next-line
      const dispose2 = form.saved((model) => {})

      expect(emit).toHaveBeenCalledWith('visualisation-sdk:form:saved-config', {
        config: {
          format: 'inlined',
          depth: 'all',
          isCDv1: false,
        },
        id: 'f0c61d3970237e725866704d6fa5487d7fce557d',
      })

      expect(emit).toHaveBeenCalledTimes(1)

      // tslint:disable-next-line
      const dispose3 = form.saved((model) => {}, { isCDv1: true })

      expect(emit).toHaveBeenCalledWith('visualisation-sdk:form:saved-config', {
        config: {
          scope: 'tree',
          fullBodyObject: true,
          isCDv1: true,
        },
        id: '035b37f17fc6ad44dea8ff7f3fd84e17064d3274',
      })

      expect(emit).toHaveBeenCalledTimes(2)

      expect(
        form.savedHandlerContainer.changeHandlers.get(
          'f0c61d3970237e725866704d6fa5487d7fce557d'
        )?.size
      ).toBe(2)

      dispose1()

      expect(
        form.savedHandlerContainer.changeHandlers.get(
          'f0c61d3970237e725866704d6fa5487d7fce557d'
        )?.size
      ).toBe(1)

      dispose2()

      expect(
        form.savedHandlerContainer.changeHandlers.get(
          'f0c61d3970237e725866704d6fa5487d7fce557d'
        )?.size
      ).toBe(0)

      expect(
        form.savedHandlerContainer.changeHandlers.get(
          '035b37f17fc6ad44dea8ff7f3fd84e17064d3274'
        )?.size
      ).toBe(1)

      dispose3()

      expect(
        form.savedHandlerContainer.changeHandlers.get(
          '035b37f17fc6ad44dea8ff7f3fd84e17064d3274'
        )?.size
      ).toBe(0)
    })

    it('should only call handlers with correct config', () => {
      // tslint:disable-next-line
      let run: Function = () => {}
      const on = jest.fn((key, _handler) => {
        run = _handler
      })
      const emit = jest.fn()

      const connection = ({
        on,
        emit,
      } as never) as ClientConnection
      const handler1 = jest.fn()
      const handler2 = jest.fn()
      const handler3 = jest.fn()

      const form = new Form(connection)

      const dispose1 = form.saved(handler1)
      const dispose2 = form.saved(handler2)
      const dispose3 = form.saved(handler3, { isCDv1: true })

      run({ handlerId: 'f0c61d3970237e725866704d6fa5487d7fce557d', model: {} })

      expect(handler1).toBeCalledTimes(1)
      expect(handler2).toBeCalledTimes(1)
      expect(handler3).not.toBeCalled()

      run({ handlerId: '035b37f17fc6ad44dea8ff7f3fd84e17064d3274', model: {} })

      expect(handler1).toBeCalledTimes(1)
      expect(handler2).toBeCalledTimes(1)
      expect(handler3).toBeCalledTimes(1)
    })
  })

  describe('changed', () => {
    it('should add handlers to call later', () => {
      let handler
      const on = jest.fn((key, _handler) => {
        handler = _handler
      })
      const emit = jest.fn()

      const connection = ({
        on,
        emit,
      } as never) as ClientConnection

      const form = new Form(connection)

      // tslint:disable-next-line
      const dispose1 = form.changed((model) => {})

      expect(
        form.changeHandlerContainer.changeHandlers.get(
          'f0c61d3970237e725866704d6fa5487d7fce557d'
        )?.size
      ).toBe(1)

      // tslint:disable-next-line
      const dispose2 = form.changed((model) => {})

      expect(emit).toHaveBeenCalledWith(
        'visualisation-sdk:form:changed-config',
        {
          config: {
            format: 'inlined',
            depth: 'all',
            isCDv1: false,
          },
          id: 'f0c61d3970237e725866704d6fa5487d7fce557d',
        }
      )

      expect(emit).toHaveBeenCalledTimes(1)

      // tslint:disable-next-line
      const dispose3 = form.changed((model) => {}, { isCDv1: true })

      expect(emit).toHaveBeenCalledWith(
        'visualisation-sdk:form:changed-config',
        {
          config: {
            scope: 'tree',
            fullBodyObject: true,
            isCDv1: true,
          },
          id: '035b37f17fc6ad44dea8ff7f3fd84e17064d3274',
        }
      )

      expect(emit).toHaveBeenCalledTimes(2)

      expect(
        form.changeHandlerContainer.changeHandlers.get(
          'f0c61d3970237e725866704d6fa5487d7fce557d'
        )?.size
      ).toBe(2)

      dispose1()

      expect(
        form.changeHandlerContainer.changeHandlers.get(
          'f0c61d3970237e725866704d6fa5487d7fce557d'
        )?.size
      ).toBe(1)

      dispose2()

      expect(
        form.changeHandlerContainer.changeHandlers.get(
          'f0c61d3970237e725866704d6fa5487d7fce557d'
        )?.size
      ).toBe(0)

      expect(
        form.changeHandlerContainer.changeHandlers.get(
          '035b37f17fc6ad44dea8ff7f3fd84e17064d3274'
        )?.size
      ).toBe(1)

      dispose3()

      expect(
        form.changeHandlerContainer.changeHandlers.get(
          '035b37f17fc6ad44dea8ff7f3fd84e17064d3274'
        )?.size
      ).toBe(0)
    })

    it('should only call handlers with correct config', () => {
      // tslint:disable-next-line
      let run: Function = () => {}
      const on = jest.fn((key, _handler) => {
        if (key === 'visualisation-sdk:form:change') {
          run = _handler
        }
      })
      const emit = jest.fn()

      const connection = ({
        on,
        emit,
      } as never) as ClientConnection
      const handler1 = jest.fn()
      const handler2 = jest.fn()
      const handler3 = jest.fn()

      const form = new Form(connection)

      const dispose1 = form.changed(handler1)
      const dispose2 = form.changed(handler2)
      const dispose3 = form.changed(handler3, { isCDv1: true })

      run({ handlerId: 'f0c61d3970237e725866704d6fa5487d7fce557d', model: {} })

      expect(handler1).toBeCalledTimes(1)
      expect(handler2).toBeCalledTimes(1)
      expect(handler3).not.toBeCalled()

      run({ handlerId: '035b37f17fc6ad44dea8ff7f3fd84e17064d3274', model: {} })

      expect(handler1).toBeCalledTimes(1)
      expect(handler2).toBeCalledTimes(1)
      expect(handler3).toBeCalledTimes(1)
    })
  })
})
