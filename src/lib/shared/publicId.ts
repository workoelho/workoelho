import Sqids from "sqids";

const sqids = new Sqids({
  minLength: 5,
});

const publicIdPrefixMap = {
  organization: 1,
  user: 2,
  application: 3,
  provider: 4,
  service: 5,
  role: 6,
  tag: 7,
  activity: 8,
  relation: 9,
};

/**
 * Guard that given value has type.
 */
export function hasType(value: unknown): value is { $type: string } {
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
export function hasPrivateId(value: unknown): value is { id: number } {
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
export function hasPublicId(value: unknown): value is { publicId: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "publicId" in value &&
    typeof value.publicId === "string"
  );
}

/**
 * Get the public ID prefix for a given model name.
 */
export function getPublicIdPrefix(name: string) {
  if (name in publicIdPrefixMap) {
    return publicIdPrefixMap[name as keyof typeof publicIdPrefixMap];
  }
  throw new Error(`No public ID prefix found for ${JSON.stringify(name)}`);
}

/**
 * Get public ID from given model instance.
 */
export function getPublicId<T extends { id: number }>(instance: T) {
  if ("$type" in instance) {
    return sqids.encode([
      getPublicIdPrefix(instance.$type as string),
      instance.id,
    ]);
  }
  throw new Error(`Model instance has no $type "${JSON.stringify(instance)}"`);
}

/**
 * Get private ID from given public ID.
 */
export function getPrivateId(publicId: string) {
  return sqids.decode(publicId)[1];
}
