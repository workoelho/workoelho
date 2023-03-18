import { Handler, Route } from "~/types";

/**
 * Router.
 */
export const router = {
  urls: new Map<string, Handler>(),
  statusCodes: new Map<number, Handler>(),
};

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
