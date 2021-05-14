import { ClientConnection } from 'message-event-channel';
import { Context } from '../context';

describe('Context', () => {
  describe('get', () => {
    it('should call connection with get context object', async () => {
      const on = jest.fn();
      const request = jest.fn(() => ({ deliveryKey: 'dsd' }));

      const connection = ({
        on,
        request,
      } as never) as ClientConnection;

      const context = new Context(connection);
      const result = await context.get();

      expect(connection.request).toBeCalledWith(
        'visualization-sdk:context:get'
      );
      expect(result).toEqual({ deliveryKey: 'dsd' });
    });
  });

  describe('changed', () => {
    it('should add handlers to call later', () => {
      // tslint:disable-next-line
      let run: Function = () => {};
      const on = jest.fn((key, _run) => {
        run = _run;
      });
      const emit = jest.fn();

      const connection = ({
        on,
        emit,
      } as never) as ClientConnection;

      const handler1 = jest.fn();
      const handler2 = jest.fn();
      const context = new Context(connection);

      const dispose1 = context.changed(handler1);
      const dispose2 = context.changed(handler2);

      expect(
        context.changeHandlerContainer.changeHandlers.get(
          '323217f643c3e3f1fe7532e72ac01bb0748c97be'
        )?.size
      ).toEqual(2);

      run({ deliveryKey: 'some-content-key' });

      expect(handler1).toBeCalledWith({ deliveryKey: 'some-content-key' });
      expect(handler2).toBeCalledWith({ deliveryKey: 'some-content-key' });

      run({ deliveryKey: 'some-content-key' });

      expect(handler1).toBeCalledWith({ deliveryKey: 'some-content-key' });
      expect(handler2).toBeCalledWith({ deliveryKey: 'some-content-key' });

      expect(connection.emit).not.toBeCalled();

      dispose1();
      dispose2();

      expect(
        context.changeHandlerContainer.changeHandlers.get(
          '323217f643c3e3f1fe7532e72ac01bb0748c97be'
        )?.size
      ).toEqual(0);
    });
  });
});
