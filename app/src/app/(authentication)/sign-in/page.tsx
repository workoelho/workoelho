import { type Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { create } from "~/src/actions/session";
import { getPublicId } from "~/src/lib/shared/publicId";

import { Form } from "./form";

export const metadata: Metadata = {
  title: "Sign in at Workoelho",
};

export default function Page() {
  const action = async (state: { message: string }, payload: FormData) => {
    "use server";

    let session;
    try {
      session = await create({
        data: {
          email: payload.get("email"),
          password: payload.get("password"),
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        return { message: error.message };
      }
      throw error;
    }

    cookies().set({
      name: "session",
      value: session.secret,
      httpOnly: true,
      // secure: true,
      sameSite: "lax",
      expires: session.expiresAt,
      path: "/",
    });

    const organizationId = getPublicId(
      session.user.memberships[0].organizationId
    );

    redirect(`/${organizationId}/summary`);
  };

  return <Form action={action} initialState={{ message: "" }} />;
}
