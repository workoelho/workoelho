import { date, defaulted, number, size, string, define } from "superstruct";
import { Time } from "~/lib/shared/Time";
import isEmail from "is-email";

export const email = define<string>("email", (value: unknown) =>
  isEmail(value as string),
);

export const expiresAt = defaulted(
  date(),
  () => new Date(Date.now() + Time.Day * 30),
);

export const name = size(string(), 1, Infinity);

export const password = size(string(), 15, Infinity);

export const userId = number();
