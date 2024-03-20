import { getPublicId } from "~/src/lib/shared/publicId";

function isModel(value: object | null): value is { id: number; $type: string } {
  return hasId(value) && "$type" in value;
}

function hasId(value: object | null): value is { id: number } {
  return value !== null && "id" in value && typeof value.id === "number";
}

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
      throw new Error("Model has no corresponding URL prefix");
  }
}

function getUrlSegment(segment: unknown): string {
  switch (typeof segment) {
    case "number": {
      return getPublicId(segment);
    }
    case "object":
      if (isModel(segment)) {
        return [getModelUrlPrefix(segment), getPublicId(segment.id)].join("/");
      }
      if (hasId(segment)) {
        return getPublicId(segment.id);
      }
      throw new Error("Bad URL segment");
    default:
      return String(segment);
  }
}

/**
 * Build a relative URL from given segments.
 */
export function getUrl(...segments: unknown[]) {
  const url = new URL(segments.map(getUrlSegment).join("/"), "http://example");
  return url.pathname;
}
