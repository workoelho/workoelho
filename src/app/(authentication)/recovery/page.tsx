import { type Metadata } from "next";
import { redirect } from "next/navigation";

import { create } from "~/src/actions/session";

import { Form } from "./form";

export const metadata: Metadata = {
  title: "Recovery at Workoelho",
};

export default async function Page() {
  const action = async (state: { message: string }, payload: FormData) => {
    "use server";

    let session;
    try {
      session = await create({
        payload: {
          email: payload.get("email"),
          recovery: true,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        return { message: error.message };
      }
      throw error;
    }

    redirect(`/recovery/message`);
  };

  return <Form action={action} initialState={{ message: "" }} />;
}
