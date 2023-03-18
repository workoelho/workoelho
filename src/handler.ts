import "urlpattern-polyfill";

import { IncomingMessage, ServerResponse } from "http";

import type { Handler, Next } from "~/types";

/**
 * Handlers chain.
 */
export const handlers: Handler[] = [];

/**
 * Create initial URL match result.
 */
function createInitialUrl(request: IncomingMessage) {
  const url = new URL(request.url ?? "/", "http://localhost");

  if ("encrypted" in request.socket) {
    url.protocol = "https";
  }

  const forwardedProtocol = request.headers["x-forwarded-proto"];
  if (forwardedProtocol) {
    if (Array.isArray(forwardedProtocol)) {
      url.protocol = forwardedProtocol[0];
    } else {
      url.protocol = forwardedProtocol;
    }
  }

  if (request.headers.host) {
    url.host = request.headers.host;
  }

  const result = new URLPattern().exec(url.href);
  if (!result) {
    throw new Error("Failed to create initial URL match result.");
  }
  return result;
}

/**
 * Main request handler.
 */
export function handleIncomingRequest(
  request: IncomingMessage,
  response: ServerResponse
) {
  const url = createInitialUrl(request);
  const context = { request, response, url };

  const next = handlers.reduceRight<Next>(
    (next, handler) => () => handler(context, next),
    () => Promise.reject(new Error("No handler was found."))
  );

  void next();
}
