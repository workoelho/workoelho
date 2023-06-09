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
 * Handler takes a request context and the next handler in the chain.
 */
export type Handler = (context: Context, next: Next) => Promise<void>;

/**
 * Route is a constraint and a handler.
 */
export type Route =
  | { url: string; handler: Handler }
  | { statusCode: number; handler: Handler };
