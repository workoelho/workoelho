"use client";

import { useFormState } from "react-dom";

import { Alert } from "~/src/components/Alert";
import { Field } from "~/src/components/Field";
import { Flex } from "~/src/components/Flex";
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

      <Flex as="footer" justifyContent="end">
        <Submit>Reset</Submit>
      </Flex>
    </Flex>
  );
}
