import { ClientConnection } from 'message-event-channel';
import { Device } from '../device';

describe('Device', () => {
  describe('get', () => {
    it('should call connection with get key and return device model', async () => {
      const on = jest.fn();
      const request = jest.fn(() => ({ width: 200, height: 300 }));

      const connection = ({
        on,
        request,
      } as never) as ClientConnection;

      const device = new Device(connection);
      const result = await device.get();

      expect(connection.request).toBeCalledWith('visualization-sdk:device:get');
      expect(result).toEqual({ width: 200, height: 300 });
    });
  });

  describe('changed', () => {
    it('should add handlers to call later', () => {
      // tslint:disable-next-line: ban-types no-empty
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
      const device = new Device(connection);

      const dispose1 = device.changed(handler1);
      const dispose2 = device.changed(handler2);

      expect(
        device.changeHandlerContainer.changeHandlers.get(
          '323217f643c3e3f1fe7532e72ac01bb0748c97be'
        )?.size
      ).toEqual(2);

      run({ width: 200, height: 300 });

      expect(handler1).toBeCalledWith({ width: 200, height: 300 });
      expect(handler2).toBeCalledWith({ width: 200, height: 300 });

      run({ width: 1200, height: 900 });

      expect(handler1).toBeCalledWith({ width: 1200, height: 900 });
      expect(handler2).toBeCalledWith({ width: 1200, height: 900 });

      expect(connection.emit).not.toBeCalled();

      dispose1();
      dispose2();

      expect(
        device.changeHandlerContainer.changeHandlers.get(
          '323217f643c3e3f1fe7532e72ac01bb0748c97be'
        )?.size
      ).toEqual(0);
    });
  });
});
