"use client";

import { useFormState } from "react-dom";

import { Alert } from "~/src/components/Alert";
import { Field } from "~/src/components/Field";
import { Flex } from "~/src/components/Flex";
import { Input } from "~/src/components/Input";
import { Select } from "~/src/components/Select";
import { Submit } from "~/src/components/Submit";
import { Props } from "~/src/lib/shared/form";

export function Form(props: Props) {
  const [state, action] = useFormState(props.action, props.initialState);

  return (
    <Flex as="form" action={action} direction="column" gap="3rem">
      {state.message ? (
        <Alert variant={state.status ?? "neutral"}>
          <p>{state.message}</p>
        </Alert>
      ) : null}

      <Flex as="fieldset" direction="column" gap="1rem">
        <Field label="Name">
          {(props) => (
            <Input
              name="name"
              required
              placeholder="Jane Doe"
              minLength={1}
              autoComplete="off"
              {...props}
            />
          )}
        </Field>

        <Field label="Email">
          {(props) => (
            <Input
              name="email"
              type="email"
              placeholder="jane@example.com"
              required
              autoComplete="off"
              {...props}
            />
          )}
        </Field>

        <Field
          label="Level"
          hint="Regular level allow reading but not writing."
        >
          {(props) => (
            <Select name="level" required {...props}>
              <option value="" hidden>
                Regular
              </option>
              <option value="regular">Regular</option>
              <option value="administrator">Administrator</option>
            </Select>
          )}
        </Field>
      </Flex>

      <Flex as="footer" justifyContent="end">
        <Submit>Add</Submit>
      </Flex>
    </Flex>
  );
}
