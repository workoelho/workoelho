import { Handler } from "~/src/handler";

/**
 * A request constraint (either URL or status code) and a handler.
 */
export type Route =
  | { url: string; handler: Handler }
  | { statusCode: number; handler: Handler };

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
      `Expected route module to export either a "url" or a "statusCode"`
    );
  }
}

push(await import("./500"));
push(await import("./404"));

push(await import("./projects/id"));
push(await import("./projects/new"));
push(await import("./projects/index"));
