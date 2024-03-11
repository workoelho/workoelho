"use client";

import Link from "next/link";
import { useFormState } from "react-dom";

import { Alert } from "~/src/components/Alert";
import { Button } from "~/src/components/Button";
import { Field } from "~/src/components/Field";
import { Flex } from "~/src/components/Flex";
import { Input } from "~/src/components/Input";
import { Submit } from "~/src/components/Submit";
import { Props as Form, State } from "~/src/lib/shared/form";

type Values = { values: { name: string } };

type Props = Form<State & Values> & {
  cancelUrl: string;
};

export function Form({ cancelUrl, ...props }: Props) {
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
      </Flex>

      <Flex as="footer" justifyContent="space-between">
        <Button as={Link} href={cancelUrl}>
          Cancel
        </Button>

        <Submit>Save</Submit>
      </Flex>
    </Flex>
  );
}
