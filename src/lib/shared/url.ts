import { getPublicId } from "~/src/lib/shared/publicId";

/**
 * Guard that given value has type.
 */
function hasType(value: unknown): value is { $type: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "$type" in value &&
    typeof value.$type === "string"
  );
}

/**
 * Guard that given value has a private ID.
 */
function hasPrivateId(value: unknown): value is { id: number } {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "number"
  );
}

/**
 * Guard that given value has a public ID.
 */
function hasPublicId(value: unknown): value is { publicId: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "publicId" in value &&
    typeof value.publicId === "string"
  );
}

const modelUrlMap: Record<string, string> = {
  organization: "organizations",
  user: "users",
  session: "sessions",
  application: "applications",
  provider: "providers",
  service: "services",
  role: "roles",
  tag: "tags",
  activity: "activity",
};

for (const [key, value] of Object.entries(modelUrlMap)) {
  modelUrlMap[value] = key;
}

/**
 * Get mapped model type from URL prefix or vice-versa.
 */
export function getMappedModelUrl(value: string) {
  if (value in modelUrlMap) {
    return modelUrlMap[value];
  }
  throw new Error(`No URL segment prefix for ${value}`);
}

/**
 * Validate and parse value into an URL segment.
 */
function getUrlSegment(value: unknown): string {
  switch (typeof value) {
    case "string":
      return value;
    case "object":
      if (hasType(value)) {
        if (hasPrivateId(value)) {
          return [getMappedModelUrl(value.$type), getPublicId(value)].join("/");
        }
        if (hasPublicId(value)) {
          return [getMappedModelUrl(value.$type), value.publicId].join("/");
        }
      }
    default:
      throw new Error(`Bad URL segment: ${JSON.stringify(value)}`);
  }
}

/**
 * Build a relative URL from given segments.
 */
export function getUrl(...segments: unknown[]) {
  const url = new URL(segments.map(getUrlSegment).join("/"), "http://example");
  return url.pathname;
}
