import { compare, hash } from "bcrypt";

/**
 * The cost factor controls how much time is needed to calculate a single BCrypt hash.
 * The higher the cost factor, the more hashing rounds are done. Increasing the cost
 * factor by 1 doubles the necessary time. The more time is necessary, the more
 * difficult is brute-forcing.
 */
const cost = 10;

/**
 * Get a random password.
 */
export function random() {
  return crypto.randomUUID();
}

/**
 * Create password hash. If plain is undefined, a random password is generated.
 */
export function create(plain: string) {
  return hash(plain, cost);
}

/**
 * Compare plain password with hash.
 */
export function validate(plain: string, hashed: string) {
  return compare(plain, hashed);
}
