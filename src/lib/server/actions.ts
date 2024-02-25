import { Prisma } from "~/src/lib/server/prisma";
import { Nullable } from "~/src/lib/shared/nullable";

type Session = Prisma.SessionGetPayload<{
  include: { user: { include: { organization: true } } };
}>;

type Object = Record<string, unknown>;

/**
 * Copies the shape of an object but disregard value types.
 *
 * The goal is to enforce non optional keys and support auto-completion,
 * but leave value validation for the runtime.
 */
type Shape<T extends {}> = {
  [K in keyof T]: unknown;
};

/**
 * Context holds information necessary to perform an action.
 */
export type Context<
  Payload extends Object = Object,
  Options extends Object = Object,
> = {
  session?: Nullable<Session>;
  payload?: Shape<Payload>;
  options?: Shape<Options>;
};
