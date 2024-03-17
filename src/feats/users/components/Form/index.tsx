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
        <Field label="Name" hint="Full or display name, no title.">
          {(props) => (
            <Input
              name="name"
              required
              placeholder="Jane Doe"
              minLength={1}
              defaultValue={state.values?.name}
              {...props}
            />
          )}
        </Field>

        <Field label="Email" hint="Prefer work email.">
          {(props) => (
            <Input
              name="email"
              type="email"
              placeholder="jane@example.com"
              required
              defaultValue={state.values?.email}
              {...props}
            />
          )}
        </Field>

        <Field
          label="Access level"
          hint="Regular access level allow reading but not writing."
        >
          {(props) => (
            <Select
              name="level"
              required
              {...props}
              defaultValue={state.values?.level}
            >
              <option value="regular">Regular</option>
              <option value="administrator">Administrator</option>
            </Select>
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

          <Submit>Save person</Submit>
        </Flex>
      </Flex>
    </Flex>
  );
}
