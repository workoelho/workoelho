import isEmail from "is-email";
import {
  date,
  defaulted,
  define,
  number,
  size,
  string,
  enums,
  coerce,
  unknown,
} from "superstruct";

import { Time } from "~/src/lib/shared/Time";

/**
 * Database ID.
 */
export const id = number();

/**
 * Parse database ID.
 */
export const parseId = coerce(number(), unknown(), (value) => {
  const int = parseInt(String(value), 10);
  if (isNaN(int)) {
    throw new Error(`Can't coerce ID ${JSON.stringify(value)}`);
  }
  return int;
});

/**
 * Email.
 */
export const email = define<string>("email", (value: unknown) =>
  isEmail(value as string),
);

/**
 * Session specific schema.
 */
export const session = {
  /**
   * Session ID.
   */
  id: string(),
  /**
   * Session expiration date.
   */
  expiresAt: defaulted(date(), () => new Date(Date.now() + Time.Day * 30)),
};

/**
 * User specific schema.
 */
export const user = {
  /**
   * User level.
   */
  level: defaulted(enums(["regular", "administrator"]), () => "regular"),
};

/**
 * Password schema.
 */
export const password = size(string(), 15, Infinity);

/**
 * A simple schema for general names.
 */
export const name = size(string(), 1, Infinity);
