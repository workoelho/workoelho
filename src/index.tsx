import { createServer, IncomingMessage, ServerResponse } from "http";
import "urlpattern-polyfill";
import { routes } from "~/routes";
import { Result } from "~/shared";

/**
 * Find matching route.
 */
async function findMatchingRoute(request: IncomingMessage): Promise<Result> {
  const url = new URL(
    request.url ?? "/",
    `http://${String(request.headers.host)}`
  );

  for await (const [pattern, handler] of routes) {
    const route = new URLPattern(pattern, url.href).exec(url);

    if (route) {
      try {
        return await handler({ request, route });
      } catch (error) {
        console.error(error);
        return { statusCode: 500 };
      }
    }
  }

  return { statusCode: 404 };
}

/**
 * Request handler.
 */
async function handler(request: IncomingMessage, response: ServerResponse) {
  performance.mark("request");

  const result = await findMatchingRoute(request);

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
