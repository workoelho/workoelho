import { Handler, Route } from "~/src/types";

export class Router {
  statusCodeRoutes = new Map<number, Handler>();
  urlRoutes = new Map<string, Handler>();

  /**
   * Push route to routes table.
   */
  push(route: Route) {
    if ("statusCode" in route) {
      this.statusCodeRoutes.set(route.statusCode, route.handler);
    } else if ("url" in route) {
      this.urlRoutes.set(route.url, route.handler);
    } else {
      throw new Error(
        `Expected route module to export either a "url" or a "statusCode"`
      );
    }
  }
}
