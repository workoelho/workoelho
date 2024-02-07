import { IncomingMessage } from "http";

import * as superstruct from "superstruct";
import { ObjectSchema } from "superstruct/dist/utils";
import * as contentType from "content-type";
import iconv from "iconv-lite";
import log from "npmlog";

import { HttpError } from "~/src/shared/error";

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
 * Get request content type.
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
    throw new HttpError(400, "Invalid request body", { cause });
  }
}

const supportedMethodOverride = ["PUT", "PATCH", "DELETE", "SEARCH"];

/**
 * Get request method.
 */
export function getMethod(request: IncomingMessage) {
  if (request.method !== "POST") {
    return request.method;
  }

  const url = new URL(request.url ?? "/", "http://localhost");
  const override = url.searchParams.get("method")?.toUpperCase();

  if (override) {
    if (supportedMethodOverride.includes(override)) {
      log.verbose("request", "Method override accepted", override);

      return override;
    }

    log.warn("request", "Invalid method override", override);

    throw new HttpError(405);
  }

  return "POST";
}
