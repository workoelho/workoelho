import { renderToStaticMarkup } from "react-dom/server";
import { ReactElement } from "react";
import { IncomingHttpHeaders } from "http";
import * as superstruct from "superstruct";
import { ObjectSchema } from "superstruct/dist/utils";

/**
 * Type that might be a promise.
 */
export type Awaitable<T> = Promise<T> | T;

/**
 * Handler context.
 */
export type Context = {
  headers: IncomingHttpHeaders;
  url: URLPatternResult;
  method: string;
};

/**
 * Handler result.
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
 * Route module type.
 */
export type Route =
  | { url: string; handler: Handler }
  | { statusCode: number; handler: Handler };

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

/**
 * Validate and coerce object against schema, returning compatible object but with nullified values on failure.
 */
export function validate<
  T extends Record<string, unknown>,
  S extends ObjectSchema
>(data: T, schema: S) {
  try {
    return superstruct.create(data, superstruct.object(schema));
  } catch (error) {
    return {} as { [K in keyof T]: null };
  }
}
