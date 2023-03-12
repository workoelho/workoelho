import { Context, Handler, Result, Route } from "~/shared";

/**
 * Router.
 */
export const router = {
  urls: new Map<string, Handler>(),
  statusCodes: new Map<number, Handler>(),
};

/**
 * Find matching URL handler.
 */
async function findMatchingUrlHandler(context: Context): Promise<Result> {
  for await (const [pathname, handler] of router.urls) {
    const url = new URLPattern({ pathname }).exec(context.url.inputs[0]);

    if (url) {
      try {
        return await handler({ ...context, url });
      } catch (error) {
        return { statusCode: 500 };
      }
    }
  }

  return { statusCode: 404 };
}

/**
 * Find matching handler.
 */
export async function findMatchingHandler(context: Context) {
  const result = await findMatchingUrlHandler(context);

  if (result.statusCode === undefined) {
    return result;
  }

  const handler = router.statusCodes.get(result.statusCode);

  if (!handler) {
    return result;
  }

  try {
    return { statusCode: result.statusCode, ...(await handler(context)) };
  } catch (error) {
    return { statusCode: 500 };
  }
}

/**
 * Register route module.
 */
function register(module: Route) {
  if ("statusCode" in module) {
    router.statusCodes.set(module.statusCode, module.handler);
  } else {
    router.urls.set(module.url, module.handler);
  }
}

register(await import("~/handlers/404"));
register(await import("~/handlers/500"));

register(await import("~/handlers/projects/get"));
register(await import("~/handlers/projects/list"));
register(await import("~/handlers/static"));
