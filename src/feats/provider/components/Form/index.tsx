"use client";

import Link from "next/link";
import { useFormState } from "react-dom";

import { Alert } from "~/src/components/Alert";
import { Button } from "~/src/components/Button";
import { Field } from "~/src/components/Field";
import { Flex } from "~/src/components/Flex";
import { Icon } from "~/src/components/Icon";
import { Input } from "~/src/components/Input";
import { Submit } from "~/src/components/Submit";
import { Props as FormProps } from "~/src/lib/server/form";

type Props = FormProps & {
  destroy?: () => Promise<void>;
  cancelUrl?: string;
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

      <Flex as="fieldset" direction="column" gap="1.5rem">
        <Field
          label="Name"
          hint="e.g. a website, a mobile provider, a front-end, a microservice, etc."
        >
          {(props) => (
            <Input
              name="name"
              placeholder="Web provider"
              required
              minLength={1}
              defaultValue={state.values?.name}
              {...props}
            />
          )}
        </Field>
      </Flex>

      <Flex as="footer" justifyContent="space-between">
        {cancelUrl ? (
          <Button as={Link} href={cancelUrl}>
            Cancel
          </Button>
        ) : null}

        <Flex gap="0.5rem" style={{ marginInlineStart: "auto" }}>
          {destroy ? (
            <Button action={destroy} variant="negative">
              Delete <Icon variant="trash" />
            </Button>
          ) : null}

          <Submit>Save</Submit>
        </Flex>
      </Flex>
    </Flex>
  );
}
