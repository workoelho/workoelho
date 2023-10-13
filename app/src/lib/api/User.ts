import { compare, hash } from "bcrypt";

export function createPassword(raw: string) {
  return hash(raw, 10);
}

export function comparePassword(raw: string, hashed: string) {
  return compare(raw, hashed);
}
