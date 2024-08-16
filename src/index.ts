import { createServer } from "node:http";
import "urlpattern-polyfill";

import type { Handler } from "~/src/shared/handler";
import { getConfig } from "~/src/config";
import { getErrorHandler } from "~/src/handlers/error";
import { getLoggerHandler } from "~/src/handlers/logger";
import { getUrlHandler } from "~/src/handlers/url";
import { getInitialHandler } from "~/src/shared/handler";
import { print } from "~/src/shared/log";

const config = getConfig();

print("log", "Configuration", config);

const handlers: Handler[] = [];

handlers.push(getLoggerHandler());
handlers.push(getErrorHandler(statusHandlerMap));
handlers.push(getUrlHandler(pathHandlerMap));

print("log", "Handlers", handlers);

const server = createServer(getInitialHandler(handlers));

server.listen(config.port, "localhost", () => {
	print("log", `Listening on http://localhost:${config.port}`);
});
