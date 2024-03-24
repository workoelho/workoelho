import { Prisma } from "~/src/lib/server/prisma";

export type Session = Prisma.SessionGetPayload<{
  include: { user: true; organization: true };
}>;

type Object = Record<string, unknown>;

/**
 * Copies the shape of an object but discard value types.
 *
 * The goal is to enforce non optional keys and support auto-completion,
 * but leave value validation for the runtime.
 */
type Shape<T extends {}> = {
  [K in keyof T]: unknown;
};

/**
 * Context to perform an action.
 */
export type Context<Payload extends Object = Object> = {
  session?: Session;
  payload?: Shape<Payload>;
};
