import { Handler } from "~/shared";

/**
 * Router map.
 */
export const routes = new Map<string, Handler>();

/**
 * Register module as handler.
 */
async function register(path: string) {
  const module = (await import(path)) as { url: string; handler: Handler };
  routes.set(module.url, module.handler);
}

void register("~/handlers/projects/list");
void register("~/handlers/projects/get");
