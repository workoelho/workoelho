import { getPublicId } from "~/src/lib/shared/publicId";

/**
 * Typecheck if given value is a model object.
 */
function isModel(value: object | null): value is { id: number; $type: string } {
  return hasId(value) && "$type" in value;
}

/**
 * Typecheck if given value is an object with an ID.
 */
function hasId(value: object | null): value is { id: number } {
  return value !== null && "id" in value && typeof value.id === "number";
}

/**
 * Get URL segment prefix for given model type.
 */
function getModelUrlPrefix(model: { $type: string }) {
  switch (model.$type) {
    case "organization":
      return "organizations";
    case "user":
      return "users";
    case "session":
      return "sessions";
    case "application":
      return "applications";
    case "provider":
      return "providers";
    case "service":
      return "services";
    case "role":
      return "roles";
    case "tag":
      return "tags";
    case "activity":
      return "activity";
    default:
      throw new Error(`No URL segment prefix for ${JSON.stringify(model)}`);
  }
}

/**
 * Validate and parse value into an URL segment.
 */
function getUrlSegment(value: unknown): string {
  switch (typeof value) {
    case "string":
      return value;
    case "object":
      if (isModel(value)) {
        return [getModelUrlPrefix(value), getPublicId(value)].join("/");
      }
    default:
      throw new Error(`Bad URL segment ${value}`);
  }
}

/**
 * Build a relative URL from given segments.
 */
export function getUrl(...segments: unknown[]) {
  const url = new URL(segments.map(getUrlSegment).join("/"), "http://example");
  return url.pathname;
}
