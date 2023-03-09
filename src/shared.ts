import { renderToStaticMarkup } from "react-dom/server";
import { ReactElement } from "react";
import { IncomingMessage } from "http";
import * as superstruct from "superstruct";

/**
 * Type that might be a promise.
 */
export type Awaitable<T> = Promise<T> | T;

/**
 * Handler context.
 */
export type Context = {
  request: IncomingMessage;
  route: URLPatternResult;
};

/**
 * Route handler result.
 */
export type Result = {
  statusCode?: number;
  headers?: Record<string, string>;
  body?: string;
};

/**
 * Route handler.
 */
export type Handler = (context: Context) => Awaitable<Result>;

/**
 * Render Component to HTML.
 */
export function render(root: ReactElement) {
  return renderToStaticMarkup(root);
}

/**
 * Id coercing struct.
 */
export const Id = superstruct.coerce(
  superstruct.number(),
  superstruct.string(),
  (value) => parseInt(value, 10)
);
