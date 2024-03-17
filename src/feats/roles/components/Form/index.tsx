"use client";

import Link from "next/link";
import { useFormState } from "react-dom";

import { Alert } from "~/src/components/Alert";
import { Button } from "~/src/components/Button";
import { Field } from "~/src/components/Field";
import { Flex } from "~/src/components/Flex";
import { Icon } from "~/src/components/Icon";
import { Input } from "~/src/components/Input";
import { Select } from "~/src/components/Select";
import { Submit } from "~/src/components/Submit";
import { Props as FormProps } from "~/src/lib/shared/form";

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

      <Flex as="fieldset" direction="column" gap="1rem">
        <Field
          label="Name"
          hint="Role name, e.g. front-end developer, designer, lead, etc."
        >
          {(props) => (
            <Input
              name="name"
              required
              placeholder="Developer"
              minLength={1}
              defaultValue={state.values?.name}
              {...props}
            />
          )}
        </Field>

        <Field label="Person" hint="Who performs this role.">
          {(props) => (
            <Input
              name="userId"
              type="text"
              placeholder="1"
              required
              defaultValue={state.values?.email}
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

          <Submit>Save role</Submit>
        </Flex>
      </Flex>
    </Flex>
  );
}
