import { createServer, IncomingMessage, ServerResponse } from "http";
import "urlpattern-polyfill";
import { findMatchingHandler } from "~/router";

/**
 * Get request protocol.
 */
function getRequestUrl(request: IncomingMessage) {
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

  return url;
}

/**
 * Request handler.
 */
async function handler(request: IncomingMessage, response: ServerResponse) {
  performance.mark("request");

  const url = getRequestUrl(request);

  const context = {
    url: new URLPattern().exec(url.href)!,
    headers: request.headers,
    method: request.method ?? "GET",
  };

  const result = await findMatchingHandler(context);

  if (result.headers) {
    for (const [key, value] of Object.entries(result.headers)) {
      response.setHeader(key, value);
    }
  }

  if (response.getHeader("content-type") === undefined) {
    response.setHeader("content-type", "text/html; charset=utf-8");
  }

  response.statusCode = result.statusCode ?? 200;
  response.end(result.body);

  const { duration } = performance.measure("request", "request");

  console.info(
    `${new Date().toISOString()} ${String(request.method)} ${String(
      request.url
    )} ${response.statusCode} ${result.body?.length ?? 0}B ${duration.toFixed(
      0
    )}ms`
  );
}

/**
 * Web server.
 */
const server = createServer((...a) => void handler(...a));
server.listen(3000, "localhost", () => {
  console.log("⚡ Listening on http://localhost:3000");
});
