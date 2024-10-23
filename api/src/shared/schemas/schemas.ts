import { z } from "zod";
import { compact } from "~/src/shared/string";

/**
 * Id schema.
 */
export const id = z.string().ulid();

/**
 * Email schema.
 */
export const email = z.string().trim().toLowerCase().email();

/**
 * Password schema.
 */
export const password = z.string().min(12);

/**
 * Name schema.
 */
export const name = z.string().transform((value) => compact(String(value)));

/**
 * Automatic datetime schema.
 */
export const datetime = z.string().datetime();

/**
 * Parse string containing true-ish values like `yes`, `true`, `1`, etc.
 */
export const trueish = z
  .union([z.string(), z.number(), z.boolean()])
  .transform((value) => {
    if (typeof value === "string") {
      return /^(t(rue)?|y(es)?|1|on)$/.test(value.trim().toLowerCase());
    }
    return !!value;
  });
