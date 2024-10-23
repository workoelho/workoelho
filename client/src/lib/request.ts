type ReqDesc<T = unknown> = {
  method: "get" | "post" | "put" | "patch" | "delete";
  headers: Record<string, string>;
  body?: T;
  query?: Record<string, unknown>;
  signal?: AbortSignal;
  credentials?: RequestCredentials;
};

type RespDesc<T = unknown> = {
  status: number;
  headers: Record<string, string>;
  body: T;
};

export async function request<T>(
  urlDesc: URL | string,
  reqDesc: Partial<ReqDesc> = {},
) {
  if ("body" in reqDesc) {
    reqDesc.method ??= "post";
    if (reqDesc.body instanceof FormData) {
      reqDesc.body = Object.fromEntries(reqDesc.body.entries());
    }
  }

  reqDesc.method ??= "get";
  reqDesc.credentials ??= "same-origin";
  reqDesc.headers ??= {};
  reqDesc.headers["Content-Type"] ??= "application/json; charset=utf-8";

  const url = new URL(urlDesc, window.location.origin);

  if (reqDesc.query) {
    for (const [key, value] of Object.entries(reqDesc.query)) {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url, {
    method: reqDesc.method,
    headers: reqDesc.headers,
    body: JSON.stringify(reqDesc.body),
    credentials: reqDesc.credentials,
    signal: reqDesc.signal,
  });

  const respDesc = {
    status: response.status,
    headers: Object.fromEntries(response.headers.entries()),
    body: (await response.json()) as T,
  };

  if (!response.ok) {
    throw respDesc as RespDesc<T>;
  }
  return respDesc as RespDesc<T>;
}
