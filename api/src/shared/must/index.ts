/**
 * Ensure value is not null or undefined.
 */
export function must<T>(value: T) {
  if (value === null || value === undefined) {
    throw new Error("Unexpected null or undefined value");
  }
  return value;
}
