import log from "npmlog";

import { Context, Handle } from "~/src/shared/handler";

/**
 * Log incoming requests.
 */
export function getLoggerHandler() {
  return async ({ request, response, url }: Context, next: Handle) => {
    performance.mark("request");

    await next();

    const { duration } = performance.measure("request", "request");

    log.info(
      "http",
      `${String(request.method)} ${String(url.pathname.input)} ${
        response.statusCode
      } ${duration.toFixed(0)}ms`
    );
  };
}
