import { compare, hash } from "bcrypt";
import { z } from "zod";

export const Password = z.string().min(12);

export const New = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  password: Password,
});

export function createPassword(raw: string) {
  return hash(raw, 10);
}

export function comparePassword(raw: string, hashed: string) {
  return compare(raw, hashed);
}
