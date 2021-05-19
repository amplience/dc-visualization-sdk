import { ClientConnection } from 'message-event-channel';
import { HandlerContainer, HandlerContainerFactory } from './handler-container';

export const KEY = 'visualization-sdk:context';

export enum CONTEXT_EVENTS {
  GET = 'visualization-sdk:context:get',
  CHANGE = 'visualization-sdk:context:change',
}

export type ContextModel = IContext;
export type ContextChangeHandler = (context: ContextModel) => void;
export type ContextChangeDispose = () => void;

export interface IContext {
  contentId: string;
  contentTypeUri: string;
  snapshotId: string | null;
  deliveryKey: string | null;
}

/**
 * Contex class allows you to get the context information of the content item you're viewing and watch for changes to asynchronously update your application
 */
export class Context {
  public changeHandlerContainer: HandlerContainer<ContextChangeHandler>;

  constructor(public connection: ClientConnection) {
    const handlerContainer = HandlerContainerFactory(connection);

    this.changeHandlerContainer = handlerContainer<ContextChangeHandler>();

    this.connection.on(CONTEXT_EVENTS.CHANGE, (context: ContextModel) => {
      this.changeHandlerContainer.run(context);
    });
  }

  /**
   * Get the current context information for the content item you're viewing
   *
   * ### Example
   *
   * ```typescript
   * const value = await visualization.context.get();
   *
   * console.log(value)
   * ```
   */
  get(): Promise<ContextModel> {
    return this.connection.request(CONTEXT_EVENTS.GET);
  }

  /**
   * Sets up a listener for when the content item context information changes.
   *
   * @param cb - callback function to be called when context information changes.
   *
   * @returns a dispose function which removes the listener
   *
   * ### Example
   *
   * ```typescript
   *  const dispose = visualization.context.changed((model) => {
   *    // handle context change
   *  })
   * ```
   */
  changed(cb: ContextChangeHandler): ContextChangeDispose {
    return this.changeHandlerContainer.add(cb);
  }
}
