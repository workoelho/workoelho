import { type Metadata } from "next";
import * as superstruct from "superstruct";

import { getValidSession } from "~/src/lib/server/session";
import { getFormProps } from "~/src/lib/server/form";
import { UnauthorizedError } from "~/src/lib/shared/errors";
import { update } from "~/src/actions/user";

import { Form } from "./form";

export const metadata: Metadata = {
  title: "My profile at Workoelho",
};

export default async function Page() {
  const session = await getValidSession();

  if (!session) {
    throw new UnauthorizedError();
  }

  const [action, initialState] = getFormProps(
    async (state, form) => {
      "use server";

      const session = await getValidSession();

      if (!session) {
        throw new UnauthorizedError();
      }

      const payload = superstruct.create(
        {
          name: form.get("name"),
          email: form.get("email"),
        },
        superstruct.object({
          name: superstruct.string(),
          email: superstruct.string(),
        })
      );

      await update({
        query: { id: session.user.id },
        payload,
      });

      return { message: "", payload };
    },
    {
      message: "",
      payload: { name: session.user.name, email: session.user.email },
    }
  );

  return <Form action={action} initialState={initialState} />;
}
