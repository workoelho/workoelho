"use client";

import Link from "next/link";
import { useFormState } from "react-dom";

import { Alert } from "~/src/components/Alert";
import { Button } from "~/src/components/Button";
import { Field } from "~/src/components/Field";
import { Flex } from "~/src/components/Flex";
import { Input } from "~/src/components/Input";
import { Select } from "~/src/components/Select";
import { Submit } from "~/src/components/Submit";
import { Props as FormProps, State } from "~/src/lib/shared/form";

type Values = { values: { name: string; email: string; level: string } };

type Props = FormProps<State & Values> & {
  destroy: () => Promise<void>;
  cancelUrl: string;
};

export function Form({ cancelUrl, destroy, ...props }: Props) {
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
              defaultValue={state.values.name}
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
              defaultValue={state.values.email}
              {...props}
            />
          )}
        </Field>

        <Field
          label="Level"
          hint="Regular level allow reading but not writing."
        >
          {(props) => (
            <Select
              name="level"
              required
              {...props}
              defaultValue={state.values.level}
            >
              <option value="regular">Regular</option>
              <option value="administrator">Administrator</option>
            </Select>
          )}
        </Field>
      </Flex>

      <Flex as="footer" justifyContent="space-between">
        <Button as={Link} href={cancelUrl}>
          Cancel
        </Button>

        <Flex gap="0.5rem">
          <Button action={destroy} variant="negative">
            Delete
          </Button>
          <Submit>Save</Submit>
        </Flex>
      </Flex>
    </Flex>
  );
}
