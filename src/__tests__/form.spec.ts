import { ClientConnection } from 'message-event-channel';
import { Form } from '../form';

import hash from 'object-hash';

describe('Form', () => {
  describe('get', () => {
    it('should call connection with get key and config passed', async () => {
      const on = jest.fn();
      const request = jest.fn(() => ({ hello: 'world' }));

      const connection = ({
        on,
        request,
      } as never) as ClientConnection;

      const form = new Form(connection);
      const result = await form.get({ depth: 'root' });

      expect(connection.request).toBeCalledWith('visualization-sdk:form:get', {
        depth: 'root',
        format: 'inlined',
        allowInvalid: false,
      });
      expect(result).toEqual({ hello: 'world' });
    });

    it('should call connection with get key and no config passed', async () => {
      const on = jest.fn();
      const request = jest.fn(() => ({ hello: 'world' }));

      const connection = ({
        on,
        request,
      } as never) as ClientConnection;

      const form = new Form(connection);
      const result = await form.get();

      expect(connection.request).toBeCalledWith('visualization-sdk:form:get', {
        depth: 'all',
        format: 'inlined',
        allowInvalid: false,
      });
      expect(result).toEqual({ hello: 'world' });
    });
  });

  describe('saved', () => {
    it('should add handlers to call later', () => {
      let handler;
      const on = jest.fn((key, _handler) => {
        handler = _handler;
      });
      const emit = jest.fn();

      const connection = ({
        on,
        emit,
      } as never) as ClientConnection;

      const form = new Form(connection);

      // tslint:disable-next-line
      const dispose1 = form.saved((model) => {});
      // tslint:disable-next-line
      const dispose3 = form.saved((model) => {}, {
        format: 'linked',
        depth: 'root',
      });

      const key1 = hash({
        depth: 'all',
        format: 'inlined',
        allowInvalid: false,
      });

      const key2 = hash({
        depth: 'root',
        format: 'linked',
        allowInvalid: false,
      });

      expect(form.savedHandlerContainer.changeHandlers.get(key1)?.size).toBe(1);

      expect(form.savedHandlerContainer.changeHandlers.get(key2)?.size).toBe(1);

      // tslint:disable-next-line
      const dispose2 = form.saved((model) => {});

      expect(emit).toHaveBeenCalledWith('visualization-sdk:form:saved-config', {
        config: {
          format: 'inlined',
          depth: 'all',
          allowInvalid: false,
        },
        id: key1,
      });

      expect(emit).toHaveBeenCalledTimes(2);

      expect(form.savedHandlerContainer.changeHandlers.get(key1)?.size).toBe(2);

      dispose1();

      expect(form.savedHandlerContainer.changeHandlers.get(key1)?.size).toBe(1);

      dispose2();

      expect(form.savedHandlerContainer.changeHandlers.get(key1)?.size).toBe(0);

      dispose3();

      expect(form.savedHandlerContainer.changeHandlers.get(key2)?.size).toBe(0);
    });

    it('should only call handlers with correct config', () => {
      // tslint:disable-next-line
      let run: Function = () => {};
      const on = jest.fn((key, _handler) => {
        run = _handler;
      });
      const emit = jest.fn();

      const connection = ({
        on,
        emit,
      } as never) as ClientConnection;
      const handler1 = jest.fn();
      const handler2 = jest.fn();

      const form = new Form(connection);

      const dispose1 = form.saved(handler1);
      const dispose2 = form.saved(handler2);

      const key1 = hash({
        depth: 'all',
        format: 'inlined',
        allowInvalid: false,
      });

      run({ handlerId: key1, model: {} });

      expect(handler1).toBeCalledTimes(1);
      expect(handler2).toBeCalledTimes(1);
    });
  });

  describe('changed', () => {
    it('should add handlers to call later', () => {
      let handler;
      const on = jest.fn((key, _handler) => {
        handler = _handler;
      });
      const emit = jest.fn();

      const connection = ({
        on,
        emit,
      } as never) as ClientConnection;

      const form = new Form(connection);

      // tslint:disable-next-line
      const dispose1 = form.changed((model) => {});

      const key1 = hash({
        depth: 'all',
        format: 'inlined',
        allowInvalid: false,
      });

      expect(form.changeHandlerContainer.changeHandlers.get(key1)?.size).toBe(
        1
      );

      // tslint:disable-next-line
      const dispose2 = form.changed((model) => {});

      expect(emit).toHaveBeenCalledWith(
        'visualization-sdk:form:changed-config',
        {
          config: {
            format: 'inlined',
            depth: 'all',
            allowInvalid: false,
          },
          id: key1,
        }
      );

      expect(emit).toHaveBeenCalledTimes(1);

      expect(form.changeHandlerContainer.changeHandlers.get(key1)?.size).toBe(
        2
      );

      dispose1();

      expect(form.changeHandlerContainer.changeHandlers.get(key1)?.size).toBe(
        1
      );

      dispose2();

      expect(form.changeHandlerContainer.changeHandlers.get(key1)?.size).toBe(
        0
      );
    });

    it('should only call handlers with correct config', () => {
      // tslint:disable-next-line
      let run: Function = () => {};
      const on = jest.fn((key, _handler) => {
        if (key === 'visualization-sdk:form:change') {
          run = _handler;
        }
      });
      const emit = jest.fn();

      const connection = ({
        on,
        emit,
      } as never) as ClientConnection;
      const handler1 = jest.fn();
      const handler2 = jest.fn();

      const form = new Form(connection);

      const dispose1 = form.changed(handler1);
      const dispose2 = form.changed(handler2);

      const key1 = hash({
        depth: 'all',
        format: 'inlined',
        allowInvalid: false,
      });

      run({ handlerId: key1, model: {} });

      expect(handler1).toBeCalledTimes(1);
      expect(handler2).toBeCalledTimes(1);

      expect(handler1).toBeCalledTimes(1);
      expect(handler2).toBeCalledTimes(1);
    });
  });
});
