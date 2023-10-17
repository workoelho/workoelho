type Key = string | number | symbol;

type Mapable = Record<string | number | symbol, unknown>;

export type Mapper<T extends Mapable, U, V> = (
  value: T[keyof T],
  key: keyof T,
  object: T
) => [U, V];

export function map<T extends Mapable, U extends Key, V>(
  object: T,
  map: Mapper<T, U, V>
) {
  return Object.fromEntries(
    Array.from(Object.entries(object)).map(([key, value]) =>
      map(value as T[keyof T], key, object)
    )
  ) as Record<U, V>;
}
