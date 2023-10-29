import { date, defaulted, number, size, string, define } from "superstruct";
import isEmail from "is-email";

import { Time } from "~/lib/shared/Time";

export const email = define<string>("email", (value: unknown) =>
  isEmail(value as string)
);

export const expiresAt = defaulted(
  date(),
  () => new Date(Date.now() + Time.Day * 30)
);

export const name = size(string(), 1, Infinity);

export const password = size(string(), 15, Infinity);

export const userId = number();

export const organization = size(string(), 1, Infinity);
