import { createServer } from "http";

import log from "npmlog";

import { getLoggerHandler } from "~/src/handlers/logger";
import { getErrorHandler } from "~/src/handlers/error";
import { getStaticHandler } from "~/src/handlers/static";
import { getUrlHandler } from "~/src/handlers/url";
import { Handler, getInitialHandler } from "~/src/shared/handler";
import { getConfig } from "~/src/config";
import { statusCodeHandlers, urlHandlers } from "~/src/routes";
import { getMethodHandler } from "~/src/handlers/method";

const config = getConfig();

if (config.verbose) {
  log.level = "verbose";
}

log.verbose("config", "Configuration dump", config);

log.verbose("handler", "Status code handlers", statusCodeHandlers);
log.verbose("handler", "URL handlers", urlHandlers);

const handlers: Handler[] = [];

handlers.push(getLoggerHandler());
handlers.push(getErrorHandler(statusCodeHandlers));
handlers.push(getStaticHandler());
handlers.push(getMethodHandler());
handlers.push(getUrlHandler(urlHandlers));

log.verbose("handler", "Handlers", handlers);

const server = createServer(getInitialHandler(handlers));

server.listen(config.port, "localhost", () => {
  log.info("http", `Listening on http://localhost:${config.port}`);
});
