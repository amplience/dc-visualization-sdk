import { ClientConnection } from 'message-event-channel';
import { DeliveryKey } from '../delivery-key';

describe('DeliveryKey', () => {
  describe('get', () => {
    it('should call connection with get key and return string', async () => {
      const on = jest.fn();
      const request = jest.fn(() => 'some-content-key');

      const connection = ({
        on,
        request,
      } as never) as ClientConnection;

      const deliveryKey = new DeliveryKey(connection);
      const result = await deliveryKey.get();

      expect(connection.request).toBeCalledWith(
        'visualization-sdk:delivery-key:get'
      );
      expect(result).toEqual('some-content-key');
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
      const deliveryKey = new DeliveryKey(connection);

      const dispose1 = deliveryKey.changed(handler1);
      const dispose2 = deliveryKey.changed(handler2);

      expect(
        deliveryKey.changeHandlerContainer.changeHandlers.get(
          '323217f643c3e3f1fe7532e72ac01bb0748c97be'
        )?.size
      ).toEqual(2);

      run('some-content-key');

      expect(handler1).toBeCalledWith('some-content-key');
      expect(handler2).toBeCalledWith('some-content-key');

      run('some-content-key');

      expect(handler1).toBeCalledWith('some-content-key');
      expect(handler2).toBeCalledWith('some-content-key');

      expect(connection.emit).not.toBeCalled();

      dispose1();
      dispose2();

      expect(
        deliveryKey.changeHandlerContainer.changeHandlers.get(
          '323217f643c3e3f1fe7532e72ac01bb0748c97be'
        )?.size
      ).toEqual(0);
    });
  });
});
