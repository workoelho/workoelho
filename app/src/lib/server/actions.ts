import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";

import {
  UnauthenticatedError,
  UnauthorizedError,
} from "~/src/lib/shared/errors";

type Session = Prisma.SessionGetPayload<{
  include: { user: { include: { memberships: true } } };
}>;

export type Context = {
  data: Record<string, unknown>;
  session?: Session | null;
};

export function withErrorHandled<T extends (...arg: any[]) => any>(fn: T) {
  return (...arg: Parameters<T>) => {
    try {
      fn(...arg);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        return redirect("/sign-in");
      }
      if (error instanceof UnauthenticatedError) {
        return redirect("/sign-in");
      }
      throw error;
    }
  };
}
