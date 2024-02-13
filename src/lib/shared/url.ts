export function getUrl(...parts: unknown[]) {
  return "/" + parts.join("/");
}
