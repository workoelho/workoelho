"use client";

import { useFormState } from "react-dom";

import { Alert } from "~/src/components/Alert";
import { Field } from "~/src/components/Field";
import { Flex } from "~/src/components/Flex";
import { Input } from "~/src/components/Input";
import { Submit } from "~/src/components/Submit";
import { Props, State } from "~/src/lib/shared/form";

type Values = { values: { email: string; name: string } };

export function Form(props: Props<State & Values>) {
  const [state, action] = useFormState(props.action, props.initialState);

  return (
    <Flex as="form" action={action} direction="column" gap="3rem">
      {state.message ? (
        <Alert variant="neutral">
          <p>{state.message}</p>
        </Alert>
      ) : null}

      <Flex as="fieldset" direction="column" gap="1rem">
        <Field label="Name">
          {(props) => (
            <Input
              name="name"
              defaultValue={state.values.name}
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
              defaultValue={state.values.email}
              placeholder="jane@example.com"
              required
              autoComplete="username"
              {...props}
            />
          )}
        </Field>
      </Flex>

      <Flex as="footer" justifyContent="end">
        <Submit>Save</Submit>
      </Flex>
    </Flex>
  );
}
