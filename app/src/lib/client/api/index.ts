type RequestConfig<T = unknown> = {
  method: "get" | "post" | "put" | "patch" | "delete";
  headers: Record<string, string>;
  body?: T;
};

type ResponseConfig<T = unknown> = {
  status: number;
  headers: Record<string, string>;
  body: T;
};

export async function request<T>(
  url: string,
  reqConfig: Partial<RequestConfig> = {}
) {
  reqConfig.headers ??= {};
  reqConfig.headers["Content-Type"] ??= "application/json; charset=utf-8";

  if ("body" in reqConfig) {
    reqConfig.method ??= "post";
    if (reqConfig.body instanceof FormData) {
      reqConfig.body = Object.fromEntries(reqConfig.body.entries());
    }
  } else {
    reqConfig.method ??= "get";
  }

  const response = await fetch(url, {
    method: reqConfig.method,
    headers: reqConfig.headers,
    body: JSON.stringify(reqConfig.body),
  });

  const respConfig = {
    status: response.status,
    headers: Object.fromEntries(response.headers.entries()),
    body: (await response.json()) as T,
  };

  if (!response.ok) {
    throw respConfig as ResponseConfig<T>;
  }

  return respConfig as ResponseConfig<T>;
}
