import { IncomingMessage, ServerResponse } from "http";

import { renderToStaticNodeStream } from "react-dom/server";
import { ReactElement } from "react";
import * as superstruct from "superstruct";
import { ObjectSchema } from "superstruct/dist/utils";
import * as contentType from "content-type";
// eslint-disable-next-line import/default
import iconv from "iconv-lite";

const supportedRequestTypes = [
  "application/x-www-form-urlencoded",
  "application/json",
];

/**
 * Parse decoded body into an object.
 */
function parseBody(body: string, type: string) {
  switch (type) {
    case "application/x-www-form-urlencoded":
      return Object.fromEntries(new URLSearchParams(body).entries());
    case "application/json":
      return JSON.parse(body) as Record<string, unknown>;
    default:
      throw new Error("Unsupported request type");
  }
}

/**
 * Parse request content type.
 */
function getContentType(request: IncomingMessage) {
  try {
    const result = contentType.parse(request);

    if (!supportedRequestTypes.includes(result.type)) {
      throw new Error(`Unsupported content type: ${result.type}`);
    }

    if (!result.parameters.charset) {
      result.parameters.charset = "utf-8";
    }

    return result;
  } catch (cause) {
    throw new HttpError(415, undefined, { cause });
  }
}

/**
 * Decode request body bytes into a string in the given charset.
 */
function decodeBody(request: IncomingMessage, charset: string) {
  const converterStream = iconv.decodeStream(charset);
  request.pipe(converterStream);

  let chunks = "";

  converterStream.on("data", (chunk) => {
    chunks += chunk as string;
  });

  return new Promise<string>((resolve, reject) => {
    converterStream.on("end", () => {
      resolve(chunks);
    });
    converterStream.on("error", (cause: unknown) => {
      reject(new HttpError(400, undefined, { cause }));
    });
  });
}

/**
 * Get a decoded, parsed, validated and coerced request body object.
 */
export async function getBody<T extends ObjectSchema>(
  request: IncomingMessage,
  schema: T
) {
  const {
    type,
    parameters: { charset },
  } = getContentType(request);

  const body = await decodeBody(request, charset);

  try {
    return superstruct.create(
      parseBody(body, type),
      superstruct.object(schema)
    );
  } catch (cause) {
    throw new HttpError(400, undefined, { cause });
  }
}

/**
 * Render Component to HTML.
 */
export function render(response: ServerResponse, root: ReactElement) {
  response.statusCode ??= 200;
  response.setHeader("Content-Type", "text/html; charset=utf-8");
  const stream = renderToStaticNodeStream(root);
  stream.pipe(response);
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
