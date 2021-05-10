import { ClientConnection, MC_EVENTS } from 'message-event-channel';
import { CONNECTION_ERRORS, Visualization } from '../connection';

describe('Connection', () => {
  it('Connection smoke screen', () => {
    expect(Visualization.create()).toBeInstanceOf(Visualization);
  });
  it('should resolve if connected', async () => {
    const vis = Visualization.create();

    const on = jest.fn((key, handler) => {
      if (key === MC_EVENTS.CONNECTED) {
        handler();
      }
    });
    vis.connection = ({
      on,
      // tslint:disable-next-line
      init: () => {},
    } as never) as ClientConnection;

    const connected = await vis.init();

    expect(connected).toBe(true);
  });

  it('should throw if failed to connect', async () => {
    const vis = Visualization.create({ timeout: false });

    const on = jest.fn((key, handler) => {
      if (key === MC_EVENTS.CONNECTION_TIMEOUT) {
        handler();
      }
    });
    vis.connection = ({
      on,
      // tslint:disable-next-line
      init: () => {},
    } as never) as ClientConnection;

    try {
      await vis.init();
    } catch (err) {
      expect(err).toBe(CONNECTION_ERRORS.CONNECTION_TIMEOUT);
    }
  });
});
