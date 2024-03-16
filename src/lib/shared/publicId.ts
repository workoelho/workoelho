import Sqids from "sqids";

const sqids = new Sqids({
  minLength: 5,
});

export function getIdPrefix(model: string) {
  const prime = 31; // Prime number used for hashing
  let hash = 0;

  for (let i = 0; i < model.length; i++) {
    hash = hash * prime + model.charCodeAt(i);
  }

  return hash;
}

export function getPublicId(id: number) {
  return sqids.encode([id]);
}

export function getPrivateId(publicId: string) {
  return sqids.decode(publicId)[0];
}
