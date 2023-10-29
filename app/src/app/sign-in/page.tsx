import { redirect } from "next/navigation";
import { create } from "~/actions/session";
import { Form } from "./form";
import classes from "./style.module.css";
import { Flex } from "~/components/Flex";
import { Heading } from "~/components/Heading";
import { Footer } from "~/components/Footer";

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
      redirect("/");
    } catch (error) {
      if (error instanceof Error) {
        return { message: error.message };
      }
      throw error;
    }
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
