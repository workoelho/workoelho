"use client";

import { type Session } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { type FormEvent } from "react";
import { z } from "zod";
import { Button } from "~/components/Button";
import { Field } from "~/components/Field";
import { Form } from "~/components/Form";
import { Input } from "~/components/Input";
import { fetch } from "~/lib/fetch";
import { passwordSchema } from "~/lib/schema/user";
import { useForm } from "~/lib/useForm";

const signInSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
});

type Data = z.infer<typeof signInSchema>;

export function SignInForm() {
  const form = useForm(signInSchema);

  const { mutate, data, isLoading, isError, isSuccess } = useMutation(
    (data: Data) => fetch<Session, Data>("POST", "/api/sessions", data),
  );

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    const data = form.parse();
    mutate(data);
  };

  return (
    <Form form={form} onSubmit={onSubmit}>
      <fieldset>
        <legend>Sign In</legend>

        <p>
          {isSuccess ? (
            <>
              ✅ Done! <code>{JSON.stringify(data)}</code>
            </>
          ) : isError ? (
            "❌ Error!"
          ) : null}
        </p>

        <Field name="email" label="E-mail">
          <Input type="email" required />
        </Field>
        <Field name="password" label="Password">
          <Input type="password" required />
        </Field>

        <footer>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Working..." : "Sign In"}
          </Button>
        </footer>
      </fieldset>
    </Form>
  );
}
