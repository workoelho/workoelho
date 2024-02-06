import bcrypt from "bcrypt";

const rounds = 10;

/**
 * Create password hash.
 */
export async function createPassword(plain: string) {
  return await bcrypt.hash(plain, rounds);
}

/**
 * Compare password with hash.
 */
export async function comparePassword(plain: string, hash: string) {
  return await bcrypt.compare(plain, hash);
}
