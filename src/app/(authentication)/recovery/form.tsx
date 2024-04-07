"use client";

import { useFormState } from "react-dom";

import { Alert } from "~/src/components/Alert";
import { Field } from "~/src/components/Field";
import { Flex } from "~/src/components/Flex";
import { Icon } from "~/src/components/Icon";
import { Input } from "~/src/components/Input";
import { Submit } from "~/src/components/Submit";
import { Props } from "~/src/lib/shared/form";

export function Form(props: Props) {
  const [state, action] = useFormState(props.action, props.initialState);

  return (
    <Flex as="form" action={action} direction="column" gap="3rem">
      {state.message ? (
        <Alert variant="negative">
          <p>{state.message}</p>
        </Alert>
      ) : null}

      <Flex as="fieldset" direction="column" gap="1rem">
        <Field label="Email">
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
      </Flex>

      <Flex justifyContent="end">
        <Submit>Request</Submit>
      </Flex>
    </Flex>
  );
}
