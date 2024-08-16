import log from "npmlog";

import type { Handler } from "~/src/shared/handler";
import { HttpError } from "~/src/shared/error";

/**
 * Handle URL routes.
 */
export function getUrlHandler(map: Map<string, Handler>): Handler {
  return async (context, next) => {
    for (const [pathname, handler] of map) {
      const url = new URLPattern({ pathname }).exec(context.url.inputs[0]);

      if (url) {
        context.url = url;
        return await handler(context, next);
      }
    }

    log.verbose("http", "No handler for route", context.url.pathname.input);

    throw new HttpError(404);
  };
}
