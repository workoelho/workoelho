import path from "path";

import send from "send";

import { HttpError } from "~/src/shared";
import { Context, Handle } from "~/src/handler";

/**
 * Handle static files, but only if previous handler threw 404.
 */
export function getStaticHandler(root = "static") {
  return async (context: Context, next: Handle) => {
    try {
      return await next();
    } catch (error) {
      if (HttpError.getStatusCode(error) !== 404) {
        throw error;
      }
    }

    await new Promise<void>((resolve, reject) => {
      const file = path.join(root, context.url.pathname.input);

      send(context.request, file)
        .on("error", reject)
        .on("end", resolve)
        .pipe(context.response);
    });
  };
}
