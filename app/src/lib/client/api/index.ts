import { type Prisma } from "@prisma/client";

interface TypedResponse<T> extends Response {
  json(): Promise<T>;
}

type ReqConfig = {
  method?: "get" | "post" | "put" | "patch" | "delete";
  headers?: Record<string, string>;
  data?: unknown;
};

export async function request<Data>(url: string, config: ReqConfig = {}) {
  const req = {
    method: config.method ?? "GET",
    headers: config.headers ?? {},
    body: "",
  };
  req.headers["Content-Type"] ??= "application/json; charset=utf-8";

  if ("data" in config) {
    req.method = config.method ?? "POST";

    if (config.data instanceof FormData) {
      req.body = JSON.stringify(Object.fromEntries(config.data.entries()));
    } else {
      req.body = JSON.stringify(config.data);
    }
  }

  const response: TypedResponse<Data> = await fetch(url, req);

  if (!response.ok) {
    throw response;
  }

  return response;
}

export type Session<T extends Prisma.SessionDefaultArgs = {}> =
  Prisma.SessionGetPayload<T>;
