import { z } from "zod";

/**
 * Id schema.
 */
export const Id = z.number().gt(0);

/**
 * Email schema.
 */
export const Email = z.string().trim().toLowerCase().email();

/**
 * Password schema.
 */
export const Password = z.string().min(15);

/**
 * Name schema.
 */
export const Name = z.preprocess(
  (value) => String(value).replace(/\s+/g, " "),
  z.string().min(1),
);
