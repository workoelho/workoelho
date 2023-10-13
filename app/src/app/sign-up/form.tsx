"use client";

import { type User } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { type FormEvent } from "react";
import { z } from "zod";
import { Button } from "~/components/Button";
import { Field } from "~/components/Field";
import { Form } from "~/components/Form";
import { Input } from "~/components/Input";
import { fetch } from "~/lib/fetch";
import { useForm } from "~/lib/useForm";

const signUpSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(13),
});

type Data = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const form = useForm(signUpSchema);

  const { mutate, data, isLoading, isError, isSuccess } = useMutation(
    (data: Data) => fetch<User, Data>("POST", "/api/users", data),
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
        <legend>Sign Up</legend>

        <p>
          {isSuccess ? (
            <>
              ✅ Done! <code>{JSON.stringify(data)}</code>
            </>
          ) : isError ? (
            "❌ Error!"
          ) : null}
        </p>

        <Field name="name" label="Name">
          <Input required />
        </Field>
        <Field name="email" label="E-mail">
          <Input type="email" required />
        </Field>
        <Field name="password" label="Password">
          <Input type="password" required />
        </Field>

        <footer>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Working..." : "Sign Up"}
          </Button>
        </footer>
      </fieldset>
    </Form>
  );
}
