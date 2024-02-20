import { getPublicId } from "~/src/lib/shared/publicId";

function hasId(value: object | null): value is { id: number } {
  return value !== null && "id" in value && typeof value.id === "number";
}

function getUrlSegment(segment: unknown) {
  switch (typeof segment) {
    case "number": {
      return getPublicId(segment);
    }
    case "object":
      if (hasId(segment)) {
        return getUrlSegment(segment.id);
      }
      throw new Error("Bad URL segment");
    default:
      return String(segment);
  }
}

export function getUrl(...segments: unknown[]) {
  return "/" + segments.map(getUrlSegment).join("/");
}
