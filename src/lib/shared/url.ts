import {
  getPublicId,
  hasType,
  hasPrivateId,
  hasPublicId,
} from "~/src/lib/shared/publicId";

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
  relation: "relations",
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
