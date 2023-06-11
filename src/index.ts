import { createServer } from "http";

import log from "npmlog";

import { getLoggerHandler } from "~/src/middlewares/logger";
import { getErrorHandler } from "~/src/middlewares/error";
import { getStaticHandler } from "~/src/middlewares/static";
import { getUrlHandler } from "~/src/middlewares/url";
import { Handler, getInitialHandler } from "~/src/handler";
import { getConfig } from "~/src/config";
import { statusCodeHandlers, urlHandlers } from "~/src/routes";

const config = getConfig();

if (config.verbose) {
  log.level = "verbose";
}

log.verbose("config", "Configuration", config);

log.verbose("handler", "Status code handlers", statusCodeHandlers);
log.verbose("handler", "URL handlers", urlHandlers);

const handlers: Handler[] = [];

handlers.push(getLoggerHandler());
handlers.push(getErrorHandler(statusCodeHandlers));
handlers.push(getStaticHandler());
handlers.push(getUrlHandler(urlHandlers));

log.verbose("handler", "Handlers", handlers);

const server = createServer(getInitialHandler(handlers));

server.listen(config.port, "localhost", () => {
  log.info("http", `Listening on http://localhost:${config.port}`);
});
