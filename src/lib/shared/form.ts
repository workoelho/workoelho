import { redirect } from "next/navigation";

import { Prisma } from "~/src/lib/server/prisma";
import { ValidationError } from "~/src/lib/server/ValidationError";
import { UnauthorizedError } from "~/src/lib/shared/errors";
import { getUrl } from "~/src/lib/shared/url";

export type State = {
  values?: Record<string, string | number | undefined>;
  status?: "positive" | "negative";
  message?: string;
};

export type Props = {
  action: (state: Awaited<State>, payload: FormData) => Promise<State> | never;
  initialState: Awaited<State>;
};

export function getFormProps(
  action: (state: State, payload: FormData) => Promise<State>,
  initialState: State = {} as State
) {
  return {
    action: async (state: State, payload: FormData): Promise<State> => {
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
