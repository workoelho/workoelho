"use client";

import Link from "next/link";
import { useFormState } from "react-dom";

import { Alert } from "~/src/components/Alert";
import { Button } from "~/src/components/Button";
import { Field } from "~/src/components/Field";
import { Flex } from "~/src/components/Flex";
import { Input } from "~/src/components/Input";
import { Submit } from "~/src/components/Submit";
import { Props as FormProps } from "~/src/lib/shared/form";

type Props = FormProps & {
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
        <Field label="Person">
          {(props) => (
            <Input
              name="userId"
              placeholder="Jane Doe"
              required
              minLength={1}
              {...props}
            />
          )}
        </Field>

        <Field label="Name">
          {(props) => (
            <Input
              name="name"
              placeholder="Lead developer"
              required
              minLength={1}
              {...props}
            />
          )}
        </Field>
      </Flex>

      <Flex as="footer" justifyContent="space-between">
        <Button as={Link} href={cancelUrl}>
          Cancel
        </Button>

        <Submit>Create role</Submit>
      </Flex>
    </Flex>
  );
}
