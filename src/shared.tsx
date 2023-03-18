import { renderToStaticMarkup } from "react-dom/server";
import { ReactElement } from "react";
import * as superstruct from "superstruct";
import { ObjectSchema } from "superstruct/dist/utils";

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

/**
 * Extract status code from error.
 */
export function getErrorStatusCode(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    typeof error.statusCode === "number"
  ) {
    return error.statusCode;
  }
}

/**
 * Error with a status code.
 */
export class HttpError extends Error {
  public statusCode: number;
  constructor(statusCode: number, ...error: Parameters<typeof Error>) {
    super(...error);
    this.statusCode = statusCode;
  }
}
