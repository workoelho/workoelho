/**
 * Replace all consecutive whitespace with a single space and trim.
 */
export function compact(string: string): string {
  return string.replaceAll(/\s+/g, " ").trim();
}

/**
 * Truncate the string to a maximum length and add ellipsis.
 */
export function truncate(string: string, length: number) {
  if (string.length > length) {
    return `${string.slice(0, length).trimEnd()}...`;
  }
  return string;
}
