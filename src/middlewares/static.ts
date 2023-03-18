import path from "path";

import send from "send";

import { getErrorStatusCode } from "~/shared";
import { Context, Next } from "~/types";

/**
 * Static file handler.
 */
export function getStaticHandler(root = "static") {
  return async (context: Context, next: Next) => {
    try {
      return await next();
    } catch (error) {
      if (getErrorStatusCode(error) !== 404) {
        throw error;
      }
    }

    return await new Promise<void>((resolve, reject) => {
      const file = path.join(root, context.url.pathname.input);

      send(context.request, file)
        .on("error", reject)
        .on("end", resolve)
        .pipe(context.response);
    });
  };
}
