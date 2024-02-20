import { Prisma } from "~/src/lib/server/prisma";
import { Nullable } from "~/src/lib/shared/nullable";

type Session = Prisma.SessionGetPayload<{
  include: { user: { include: { organization: true } } };
}>;

export type Context = {
  query?: Record<string, unknown>;
  payload?: Record<string, unknown>;
  session?: Nullable<Session>;
};
