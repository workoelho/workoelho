import { Handler } from "~/src/shared/handler";
import { getMethod } from "~/src/shared/request";

/**
 * Support method override.
 */
export function getMethodHandler(): Handler {
  return async (context, next) => {
    context.request.method = getMethod(context.request);
    await next();
  };
}
