type XResponse<T> = Response & {
  json(): Promise<T>;
};

type ReqConfig<ReqData> = {
  headers?: Record<string, string>;
} & (
  | {
      method?: "GET" | "DELETE";
    }
  | {
      method?: "POST" | "PUT" | "PATCH";
      data: ReqData;
    }
);

export async function get<RespData, ReqData = unknown>(
  url: string,
  config: ReqConfig<ReqData> = {}
) {
  const init = {
    method: config.method ?? "GET",
    headers: config.headers ?? {},
    body: "" as any,
  };
  init.headers["Content-Type"] ??= "application/json; charset=utf-8";

  if ("data" in config) {
    init.method = config.method ?? "POST";

    if (config.data instanceof FormData) {
      init.body = JSON.stringify(Object.fromEntries(config.data.entries()));
    } else {
      init.body = JSON.stringify(config.data);
    }
  }

  const response = (await fetch(url, init)) as XResponse<RespData>;

  if (!response.ok) {
    throw response;
  }

  return response;
}
