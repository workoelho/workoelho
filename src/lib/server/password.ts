import { compare, hash } from "bcrypt";

const rounds = 10;

/**
 * Create salted password hash.
 */
export function createPassword(plain: string) {
  return hash(plain, rounds);
}

/**
 * Compare plain password with hash.
 */
export function comparePassword(plain: string, hashed: string) {
  return compare(plain, hashed);
}
