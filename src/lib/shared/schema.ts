import isEmail from "is-email";
import { v4 as isUuid } from "is-uuid";
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
  optional,
} from "superstruct";

import { Time } from "~/src/lib/shared/Time";
import { getPrivateId } from "~/src/lib/shared/publicId";

/**
 * Parse an ID.
 */
function parseId(value: unknown) {
  switch (typeof value) {
    case "number":
      return value;
    case "string":
      return getPrivateId(value);
    default:
      throw new Error(`Can't parse ID "${JSON.stringify(value)}"`);
  }
}

/**
 * ID.
 */
export const id = coerce(number(), unknown(), parseId);

/**
 * Optional ID.
 */
export const optionalId = coerce(
  optional(number()),
  unknown(),
  (value: unknown) => {
    if (value === undefined) {
      return undefined;
    }
    return parseId(value);
  },
);

/**
 * UUID.
 */
export const uuid = define<string>("uuid", (value: unknown) =>
  isUuid(String(value)),
);

/**
 * URL.
 */
export const url = define<string>("url", (value: unknown) =>
  new URL(String(value)).toString(),
);

/**
 * Device ID.
 */
export const deviceId = uuid;

/**
 * Email.
 */
export const email = define<string>("email", (value: unknown) =>
  isEmail(String(value)),
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
