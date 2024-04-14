/**
 * Map an object into another object of same size.
 */
export function mapObject<
  T extends Record<string | number | symbol, unknown>,
  K extends string | number | symbol,
  V,
>(
  object: T,
  map: (key: keyof T, value: T[keyof T], object: T) => [key: K, value: V]
) {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) =>
      map(key as keyof T, value as T[keyof T], object)
    )
  ) as Record<K, V>;
}
