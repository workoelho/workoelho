// biome-ignore lint/suspicious/noExplicitAny: ...
type Distributed<T> = T extends any ? keyof T : never;

type Value<T, K extends keyof T> = T extends { [_ in K]: infer U }
  ? U
  : T extends { [_ in K]?: infer U }
    ? U
    : never;

/**
 * Invokes callback if key is present in options.
 */
export function scope<
  T extends Record<string, unknown>,
  K extends Distributed<T>,
>(options: T, key: K, callback: (value: Value<T, K>) => void) {
  if (key in options) {
    callback(options[key] as Value<T, K>);
  }
}
