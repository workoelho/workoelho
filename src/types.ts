import "urlpattern-polyfill";

import { IncomingMessage, ServerResponse } from "http";

/**
 * Request context.
 */
export type Context = {
  request: IncomingMessage;
  url: URLPatternResult;
  response: ServerResponse;
};

/**
 * Next handler in the chain.
 */
export type Next = () => Promise<void>;

/**
 * Handler is function that takes a request context and the next handler in the chain.
 */
export type Handler = (context: Context, next: Next) => Promise<void>;

/**
 * Middleware is a factory function that produces the promise of a handler.
 */
export type Middleware<T extends unknown[]> = (...a: T) => Promise<Handler>;

/**
 * Route is a constraint plus a handler.
 */
export type Route =
  | { url: string; handler: Handler }
  | { statusCode: number; handler: Handler };
