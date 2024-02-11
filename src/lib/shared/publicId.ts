import Sqids from "sqids";

const sqids = new Sqids({
  minLength: 5,
});

export function getPublicId(id: number) {
  return sqids.encode([id]);
}

export function getPrivateId(publicId: string) {
  return sqids.decode(publicId)[0];
}
