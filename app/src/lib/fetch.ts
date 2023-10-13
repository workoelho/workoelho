type ApiData<T> = { data: T };

type ApiResponse<T> = Response & {
  json(): Promise<ApiData<T>>;
};

export function fetch<T, P>(method: string, url: string, payload?: P) {
  return window.fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: payload ? JSON.stringify(payload) : undefined,
  }) as Promise<ApiResponse<T>>;
}
