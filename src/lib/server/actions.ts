import { redirect } from "next/navigation";

import { Prisma } from "~/src/lib/server/prisma";
import { UnauthorizedError } from "~/src/lib/shared/errors";
import { Nullable } from "~/src/lib/shared/nullable";

type Session = Prisma.SessionGetPayload<{
  include: { user: { include: { organization: true } } };
}>;

export type Context = {
  query?: Record<string, unknown>;
  payload?: Record<string, unknown>;
  session?: Nullable<Session>;
};

export function withErrorHandled<T extends (...arg: any[]) => any>(fn: T) {
  return (...arg: Parameters<T>) => {
    try {
      fn(...arg);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        return redirect("/sign-in");
      }
      throw error;
    }
  };
}
