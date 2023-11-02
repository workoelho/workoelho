"use client";

import { useFormState } from "react-dom";

import { Alert } from "~/components/Alert";
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
        <Heading as="legend" level={2}>
          Sign up
        </Heading>

        <p>
          Already signed up? <Link href="/sign-in">Sign in, instead</Link>.
        </p>

        {state.message ? (
          <Alert variant="negative">
            <p>{state.message}</p>
          </Alert>
        ) : null}

        <Field label="Organization" hint="Company or organization you work at.">
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
              {...props}
            />
          )}
        </Field>
      </Flex>

      <Flex justifyContent="end">
        <Submit size="large" variant="primary">
          Sign up
        </Submit>
      </Flex>
    </Flex>
  );
}
