type Mapable = Record<string | number | symbol, unknown>;

export type Mapper<T extends Mapable, U> = (
  value: T[keyof T],
  key: keyof T,
  object: T,
) => U;

export function mapValues<T extends Mapable, U>(object: T, map: Mapper<T, U>) {
  return Object.fromEntries(
    Array.from(Object.entries(object)).map(([key, value]) => [
      key,
      map(value as T[keyof T], key, object),
    ]),
  );
}
