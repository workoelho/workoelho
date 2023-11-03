"use client";

import { useFormState } from "react-dom";

import { Alert } from "~/components/Alert";
import { Brand } from "~/components/Brand";
import { Field } from "~/components/Field";
import { Flex } from "~/components/Flex";
import { Heading } from "~/components/Heading";
import { Input } from "~/components/Input";
import { Link } from "~/components/Link";
import { Submit } from "~/components/Submit";
import * as Schema from "~/lib/shared/schema";

type Props<T> = {
  action: (state: T, payload: FormData) => never | Promise<T>;
  initialState: T;
};

export function Form<T extends { message: string }>({
  action,
  initialState,
}: Props<T>) {
  const [state, handledAction] = useFormState(action, initialState);

  return (
    <Flex as="form" action={handledAction} direction="column" gap="1.5rem">
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
        <Submit size="large" variant="primary">
          Sign up
        </Submit>
      </Flex>
    </Flex>
  );
}
