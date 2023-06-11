import { HttpError } from "~/src/shared";
import { Handler } from "~/src/handler";

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

    throw new HttpError(404);
  };
}
