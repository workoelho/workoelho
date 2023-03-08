import { createServer, IncomingMessage, ServerResponse } from "http";
import "urlpattern-polyfill";

/**
 * Type that might be a promise.
 */
type Awaitable<T> = Promise<T> | T;

/**
 * Handler context.
 */
type Context = {
  request: IncomingMessage;
  route: URLPatternResult;
};

/**
 * Route handler result.
 */
type Result = {
  statusCode?: number;
  headers?: Record<string, string>;
  body?: string;
};

/**
 * Route handler.
 */
type Handler = (context: Context) => Awaitable<Result>;

// ---
// ---
// ---

/**
 * Router map.
 */
const router = new Map<string, Handler>();

router.set(
  "/projects",

  (context) => {
    if (context.request.method !== "GET") {
      return { statusCode: 405 };
    }

    return {
      body: `all projects`,
    };
  }
);

router.set(
  "/projects/:id",

  (context) => {
    if (context.request.method !== "GET") {
      return { statusCode: 405 };
    }

    return {
      body: `project ${context.route.pathname.groups.id}`,
    };
  }
);

/**
 * Find matching route.
 */
async function findMatchingRoute(request: IncomingMessage): Promise<Result> {
  const url = new URL(request.url ?? "/", `http://${request.headers.host}`);

  for await (const [pattern, handler] of router) {
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
    `${new Date().toISOString()} ${request.method} ${request.url} ${
      response.statusCode
    } ${result.body?.length ?? 0}B ${duration.toFixed(0)}ms`
  );
}

/**
 * Web server.
 */
const server = createServer(handler);
server.listen(3000, "localhost", () => {
  console.log("⚡ Listening on http://localhost:3000");
});
