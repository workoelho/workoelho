import { Handler } from "~/src/shared/handler";

export const statusHandlerMap = new Map<number, Handler>();

statusHandlerMap.set(500, await import("./public/500"));
statusHandlerMap.set(404, await import("./public/404"));
statusHandlerMap.set(401, await import("./public/401"));
statusHandlerMap.set(400, await import("./public/400"));

export const pathHandlerMap = new Map();

pathHandlerMap.set("/organizations/new", await import("./public/organizations/new"));
pathHandlerMap.set("/organizations", await import("./public/organizations/root"));

pathHandlerMap.set("/sessions/new", await import("./public/sessions/new"));
pathHandlerMap.set("/sessions", await import("./public/sessions/root"));
