import { Prisma } from "~/src/lib/server/prisma";
import { Nullable } from "~/src/lib/shared/nullable";

type Session = Prisma.SessionGetPayload<{
  include: { user: { include: { organization: true } } };
}>;

type Object = Record<string, unknown>;

/**
 * Context holds information necessary to perform an action.
 */
export type Context<
  Query extends Object = Object,
  Payload extends Object = Object,
> = {
  query?: Query;
  payload?: Payload;
  session?: Nullable<Session>;
};
