type Key = string | number | symbol;

type Mapable = Record<Key, unknown>;

export type Mapper<M extends Mapable, K, V> = (
  value: M[keyof M],
  key: keyof M,
  object: M,
) => [K, V];

export function map<M extends Mapable, K extends Key, V>(
  object: M,
  map: Mapper<M, K, V>,
) {
  return Object.fromEntries(
    Array.from(Object.entries(object)).map(([key, value]) =>
      map(value as M[keyof M], key, object),
    ),
  ) as Record<K, V>;
}
