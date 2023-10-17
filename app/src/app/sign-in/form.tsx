"use client";

import { useFormState } from "react-dom";
import { Field } from "~/components/Field";
import { Input } from "~/components/Input";
import { Submit } from "~/components/Submit";
import { Flex } from "~/components/Flex";
import { Issue } from "~/lib/shared/InvalidInput";

type Props<T> = {
  action: (state: T, payload: FormData) => Promise<T>;
};

export function Form({ action: initialAction }: Props<Issue[] | null>) {
  const [issues, action] = useFormState(initialAction, null);

  return (
    <form method="POST" action={action}>
      <Flex as="fieldset" flexDirection="column" gap="1.5rem">
        <legend>Sign In</legend>

        <Field
          label="E-mail"
          hint={issues?.find(({ path }) => path.includes("email"))?.code}
        >
          {({ fieldId, hintId }) => (
            <Input
              id={fieldId}
              aria-describedby={hintId}
              name="email"
              type="email"
              required
            />
          )}
        </Field>

        <Field label="Password">
          {({ fieldId, hintId }) => (
            <Input
              id={fieldId}
              aria-describedby={hintId}
              name="password"
              type="password"
              required
            />
          )}
        </Field>

        <footer>
          <Submit>Sign In</Submit>
        </footer>
      </Flex>
    </form>
  );
}
