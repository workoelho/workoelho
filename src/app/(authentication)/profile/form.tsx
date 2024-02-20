"use client";

import { useFormState } from "react-dom";

import { Alert } from "~/src/components/Alert";
import { Field } from "~/src/components/Field";
import { Flex } from "~/src/components/Flex";
import { Heading } from "~/src/components/Heading";
import { Input } from "~/src/components/Input";
import { Link } from "~/src/components/Link";
import { Submit } from "~/src/components/Submit";
import { Props } from "~/src/lib/server/form";

type State = { message: string; payload: { email: string; name: string } };

export function Form({ action, initialState }: Props<State>) {
  const [state, dispatch] = useFormState(action, initialState);

  return (
    <Flex as="form" action={dispatch} direction="column" gap="3rem">
      <Flex as="fieldset" direction="column" gap="3rem">
        <Flex direction="column" gap="1rem" style={{ textAlign: "center" }}>
          <Heading as="legend" size="large">
            My profile
          </Heading>
          <p>
            Update your information below. Optionally you may want to{" "}
            <Link href="/reset">reset your password</Link>.
          </p>
        </Flex>

        {state.message ? (
          <Alert variant="negative">
            <p>{state.message}</p>
          </Alert>
        ) : null}

        <Flex direction="column" gap="1rem">
          <Field label="Name">
            {(props) => (
              <Input
                name="name"
                value={state.payload.name}
                required
                placeholder="Jane Doe"
                minLength={1}
                {...props}
              />
            )}
          </Field>

          <Field label="E-mail">
            {(props) => (
              <Input
                type="email"
                name="email"
                value={state.payload.email}
                placeholder="jane@example.com"
                required
                autoComplete="username"
                {...props}
              />
            )}
          </Field>
        </Flex>
      </Flex>

      <Flex justifyContent="end">
        <Submit>Save</Submit>
      </Flex>
    </Flex>
  );
}
