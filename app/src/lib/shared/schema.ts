import isEmail from "is-email";
import { date, defaulted, define, size, string } from "superstruct";

import { Time } from "~/src/lib/shared/Time";

export const email = define<string>("email", (value: unknown) =>
  isEmail(value as string)
);

export const expiresAt = defaulted(
  date(),
  () => new Date(Date.now() + Time.Day * 30)
);

export const name = size(string(), 1, Infinity);

export const password = size(string(), 15, Infinity);

export const organization = size(string(), 1, Infinity);
