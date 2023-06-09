import { createServer } from "http";

import log from "npmlog";

import { getLoggerHandler } from "~/src/middlewares/logger";
import { getErrorHandler } from "~/src/middlewares/error";
import { getStaticHandler } from "~/src/middlewares/static";
import { getUrlHandler } from "~/src/middlewares/url";
import { getInitialHandler } from "~/src/handler";
import { getConfig } from "~/src/config";
import { Handler } from "~/src/types";
import { Router } from "~/src/router";

const config = getConfig();

log.verbose("config", "Configuration loaded", config);

const router = new Router();

router.push(await import("~/src/pages/500"));
router.push(await import("~/src/pages/404"));

router.push(await import("~/src/pages/projects/id"));
router.push(await import("~/src/pages/projects/new"));
router.push(await import("~/src/pages/projects/index"));

log.verbose("router", "Routes loaded", router);

const handlers: Handler[] = [];

handlers.push(getLoggerHandler());
handlers.push(getErrorHandler(router.statusCodeRoutes));
handlers.push(getStaticHandler());
handlers.push(getUrlHandler(router.urlRoutes));

log.verbose("handler", "Handlers loaded", handlers);

const server = createServer(getInitialHandler(handlers));

server.listen(config.port, "localhost", () => {
  log.info("http", `Listening on http://localhost:${config.port}`);
});
