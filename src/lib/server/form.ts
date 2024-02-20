import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";

import { ValidationError } from "~/src/lib/server/ValidationError";
import { UnauthorizedError } from "~/src/lib/shared/errors";

export type Props<T> = {
  action: (state: Awaited<T>, payload: FormData) => Promise<T> | never;
  initialState: Awaited<T>;
};

export type State = {
  message: string;
  payload: Record<string, string | string[]>;
};

export function getFormProps<S extends State>(
  action: (state: S, payload: FormData) => Promise<S>,
  initialState: S = { message: "", payload: {} } as S
) {
  return [
    async (state: S, payload: FormData) => {
      "use server";

      try {
        return await action(state, payload);
      } catch (error) {
        if (error instanceof ValidationError) {
          return { ...state, message: error.message };
        }

        // Not found errors.
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2025"
        ) {
          return { ...state, message: error.message };
        }

        if (error instanceof UnauthorizedError) {
          redirect("/sign-in");
        }

        throw error;
      }
    },

    initialState,
  ] as const;
}
