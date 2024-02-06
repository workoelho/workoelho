import { Handler } from "~/src/shared/handler";

/**
 * A request constraint by URL and its handler.
 */
export type UrlRoute = {
  url: string;
  handler: Handler;
};

/**
 * A request constraint by status code and its handler.
 */
export type StatusRoute = {
  statusCode: number;
  handler: Handler;
};

/**
 * A request constraint by URL or status code and its handler.
 */
export type Route = UrlRoute | StatusRoute;

/**
 * Status code routes.
 */
export const statusCodeHandlers = new Map<number, Handler>();

/**
 * URL routes.
 */
export const urlHandlers = new Map<string, Handler>();

/**
 * Push route to the table.
 */
function push(route: Route) {
  if ("statusCode" in route) {
    statusCodeHandlers.set(route.statusCode, route.handler);
  } else if ("url" in route) {
    urlHandlers.set(route.url, route.handler);
  } else {
    throw new Error(
      `Expected route module to export either a "url" or a "statusCode"`,
    );
  }
}

/**
 * Build routing table.
 */
push(await import("./500"));
push(await import("./404"));

push(await import("./applications/id"));
push(await import("./applications/new"));
push(await import("./applications/index"));
