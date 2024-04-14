"use client";

import { useFormState } from "react-dom";

import { Alert } from "~/src/components/Alert";
import { Field } from "~/src/components/Field";
import { Flex } from "~/src/components/Flex";
import { Icon } from "~/src/components/Icon";
import { Input } from "~/src/components/Input";
import { Submit } from "~/src/components/Submit";
import { Props } from "~/src/lib/server/form";

export function Form(props: Props) {
  const [state, action] = useFormState(props.action, props.initialState);

  return (
    <Flex as="form" action={action} direction="column" gap="3rem">
      {state.message ? (
        <Alert variant="negative">
          <p>{state.message}</p>
        </Alert>
      ) : null}

      <Flex as="fieldset" direction="column" gap="1.5rem">
        <Field label="Organization" hint="Name of your team or company.">
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

        <Field label="Email" hint="Your work email.">
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

      <Flex as="footer" justifyContent="end">
        <Submit>
          Sign up
          <Icon variant="arrow-right" />
        </Submit>
      </Flex>
    </Flex>
  );
}
