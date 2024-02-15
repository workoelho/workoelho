import { type Metadata } from "next";
import { redirect } from "next/navigation";

import { create } from "~/src/actions/session";
import { getPublicId } from "~/src/lib/shared/publicId";
import { setSession } from "~/src/lib/server/session";

import { Form } from "./form";

export const metadata: Metadata = {
  title: "Sign in at Workoelho",
};

export default async function Page() {
  const action = async (state: { message: string }, payload: FormData) => {
    "use server";

    const session = await create({
      payload: {
        email: payload.get("email"),
        password: payload.get("password"),
      },
    });

    setSession(session);

    const organizationId = getPublicId(session.user.organizationId);

    redirect(`/organizations/${organizationId}`);
  };

  return <Form action={action} initialState={{ message: "" }} />;
}
