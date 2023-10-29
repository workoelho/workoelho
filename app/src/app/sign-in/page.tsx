import { redirect } from "next/navigation";
import { type Metadata } from "next";

import { create } from "~/actions/session";
import { Flex } from "~/components/Flex";
import { Footer } from "~/components/Footer";

import { Form } from "./form";
import classes from "./style.module.css";

export const metadata: Metadata = {
  title: "Sign in at Workoelho",
};

export default function Page() {
  const action = async (state: { message: string }, payload: FormData) => {
    "use server";

    try {
      await create(
        {},
        {
          email: payload.get("email"),
          password: payload.get("password"),
        }
      );
    } catch (error) {
      if (error instanceof Error) {
        return { message: error.message };
      }
      throw error;
    }

    redirect("/dashboard");
  };

  return (
    <div className={classes.layout}>
      <Flex as="main" flexDirection="column" className={classes.content}>
        <Form action={action} initialState={{ message: "" }} />
      </Flex>
      <Footer className={classes.footer} />
    </div>
  );
}
