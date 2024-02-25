import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";

import { ValidationError } from "~/src/lib/server/ValidationError";
import { UnauthorizedError } from "~/src/lib/shared/errors";
import { getUrl } from "~/src/lib/shared/url";

export type Props<T extends State = State> = {
  action: (state: Awaited<T>, payload: FormData) => Promise<T> | never;
  initialState: Awaited<T>;
};

export type State = {
  status?: "positive" | "negative";
  values?: Record<string, string | string[]>;
  message?: string;
};

export function getFormProps<S extends State>(
  action: (state: S, payload: FormData) => Promise<S>,
  initialState: S = {} as S,
) {
  return {
    action: async (state: S, payload: FormData) => {
      "use server";

      try {
        return await action(state, payload);
      } catch (error) {
        if (error instanceof ValidationError) {
          return { ...state, status: "negative", message: error.message };
        }

        // "Not found" errors.
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2025"
        ) {
          return { ...state, status: "negative", message: error.message };
        }

        if (error instanceof UnauthorizedError) {
          redirect(getUrl("sign-in"));
        }

        throw error;
      }
    },

    initialState,
  } as const;
}
