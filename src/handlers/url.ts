import log from "npmlog";

import { HttpError } from "~/src/shared/error";
import { Handler } from "~/src/shared/handler";

/**
 * Handle URL routes.
 */
export function getUrlHandler(routes: Map<string, Handler>): Handler {
  return async (context, next) => {
    for (const [pathname, handler] of routes) {
      const url = new URLPattern({ pathname }).exec(context.url.inputs[0]);

      if (url) {
        context.url = url;
        return await handler(context, next);
      }
    }

    log.warn("http", "No handler for URL", context.url.inputs[0]);

    throw new HttpError(404);
  };
}
