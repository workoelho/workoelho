import { createServer } from "http";

import log from "npmlog";

import { handleIncomingRequest, handlers } from "~/handler";
import { getLoggerHandler } from "~/middlewares/logger";
import { getErrorHandler } from "~/middlewares/error";
import { getUrlHandler } from "~/middlewares/url";
import { router } from "~/router";
import { getStaticHandler } from "~/middlewares/static";

handlers.push(getLoggerHandler());
handlers.push(getErrorHandler(router.statusCodes));
handlers.push(getStaticHandler());
handlers.push(getUrlHandler(router.urls));

const server = createServer(handleIncomingRequest);

server.listen(3000, "localhost", () => {
  log.info("http", "Listening on http://localhost:3000");
});
