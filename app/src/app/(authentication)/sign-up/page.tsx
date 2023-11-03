import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { create } from "~/actions/user";

import { Form } from "./form";

export const metadata: Metadata = {
  title: "Sign up at Workoelho",
};

export default function Page() {
  const action = async (state: { message: string }, payload: FormData) => {
    "use server";

    let user;
    try {
      user = await create(
        {},
        {
          name: payload.get("name"),
          organization: payload.get("organization"),
          email: payload.get("email"),
          password: payload.get("password"),
        },
      );
    } catch (error) {
      if (error instanceof Error) {
        return { message: error.message };
      }
      throw error;
    }

    cookies().set({
      name: "session",
      value: user.sessions[0].secret,
      httpOnly: true,
      // secure: true,
      sameSite: "lax",
      expires: user.sessions[0].expiresAt,
      path: "/",
    });

    redirect(`/${user.memberships[0].organizationId}/summary`);
  };

  return <Form action={action} initialState={{ message: "" }} />;
}
