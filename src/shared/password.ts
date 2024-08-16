import bcrypt from "bcrypt";

const rounds = 10;

/**
 * Create password hash.
 */
export async function hash(password: string) {
	return await bcrypt.hash(password, rounds);
}

/**
 * Compare plain password with hash.
 */
export async function compare(plain: string, hash: string) {
	return await bcrypt.compare(plain, hash);
}
