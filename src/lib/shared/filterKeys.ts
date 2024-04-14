/**
 * Return a partial object with only the keys that pass the filter.
 */
export function filterKeys<T extends Record<string | number | symbol, unknown>>(
  object: T,
  filter: (key: keyof T, value: T[keyof T], object: T) => boolean
) {
  return Object.fromEntries(
    Object.entries(object).filter(([key, value]) =>
      filter(key as keyof T, value as T[keyof T], object)
    )
  ) as Partial<T>;
}
