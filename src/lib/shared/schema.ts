import isEmail from "is-email";
import { date, defaulted, define, number, size, string } from "superstruct";

import { Time } from "~/src/lib/shared/Time";

/**
 * Private database ID.
 */
export const id = number();

/**
 * Email.
 */
export const email = define<string>("email", (value: unknown) =>
  isEmail(value as string)
);

/**
 * Session specific schemas.
 */
export const session = {
  /**
   * Session expiration date.
   */
  expiresAt: defaulted(date(), () => new Date(Date.now() + Time.Day * 30)),
};

/**
 * Password schema.
 */
export const password = size(string(), 15, Infinity);

/**
 * A simple schema for general names.
 */
export const name = size(string(), 1, Infinity);
