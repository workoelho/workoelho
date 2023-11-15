"use client";

import { useFormState } from "react-dom";

import { Alert } from "~/src/components/Alert";
import { Field } from "~/src/components/Field";
import { Flex } from "~/src/components/Flex";
import { Input } from "~/src/components/Input";
import { Link } from "~/src/components/Link";
import { Submit } from "~/src/components/Submit";

type Props<T> = {
  action: (state: Awaited<T>, payload: FormData) => Promise<T> | never;
  initialState: Awaited<T>;
};

export function Form<T extends { message: string }>({
  action,
  initialState,
}: Props<T>) {
  const [state, dispatch] = useFormState(action, initialState);

  return (
    <Flex as="form" action={dispatch} direction="column" gap="1.5rem">
      <Flex as="fieldset" direction="column" gap="1.5rem">
        <legend hidden>Sign up</legend>

        <p>
          Already signed up? <Link href="/sign-in">Sign in, instead</Link>.
        </p>

        {state.message ? (
          <Alert variant="negative">
            <p>{state.message}</p>
          </Alert>
        ) : null}

        <Flex direction="column" gap="0.75rem">
          <Field
            label="Organization"
            hint="You can have multiple organizations."
          >
            {(props) => (
              <Input
                name="organization"
                required
                placeholder="ACME Inc."
                minLength={1}
                {...props}
              />
            )}
          </Field>

          <Field label="Name">
            {(props) => (
              <Input
                name="name"
                required
                placeholder="Jane Doe"
                minLength={1}
                {...props}
              />
            )}
          </Field>

          <Field label="E-mail" hint="Your work e-mail.">
            {(props) => (
              <Input
                name="email"
                type="email"
                placeholder="jane@example.com"
                required
                autoComplete="username"
                {...props}
              />
            )}
          </Field>

          <Field label="Password" hint="At least 15 characters long.">
            {(props) => (
              <Input
                name="password"
                type="password"
                placeholder="⁕⁕⁕⁕⁕⁕⁕⁕⁕⁕⁕⁕⁕⁕⁕"
                minLength={15}
                required
                autoComplete="new-password"
                {...props}
              />
            )}
          </Field>
        </Flex>
      </Flex>

      <Flex justifyContent="end">
        <Submit variant="primary" size="large">
          Sign up
        </Submit>
      </Flex>
    </Flex>
  );
}
