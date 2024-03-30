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
};

/**
 * Get the public ID prefix for a given model name.
 */
export function getPublicIdPrefix(name: string) {
  if (name in publicIdPrefixMap) {
    return publicIdPrefixMap[name as keyof typeof publicIdPrefixMap];
  }
  throw new Error(`No public ID prefix found for ${name}`);
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
