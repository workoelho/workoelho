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
import { useAutoFocus } from "~/src/lib/client/autoFocus";
import { Props as FormProps } from "~/src/lib/shared/form";

type Props = FormProps & {
  destroy?: () => Promise<void>;
  cancelUrl?: string;
};

export function Form({ cancelUrl, destroy, ...props }: Props) {
  const [state, action] = useFormState(props.action, props.initialState);
  const autoFocusRef = useAutoFocus();

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
          hint="e.g. Load balancer, Code repository, Hosting, DNS, etc."
        >
          {(props) => (
            <Input
              name="name"
              placeholder="Database"
              required
              minLength={1}
              defaultValue={state.values?.name}
              {...props}
              ref={autoFocusRef}
            />
          )}
        </Field>

        <Field
          label="Application"
          hint="The application that depends on this service."
        >
          {(props) => (
            <Input
              name="applicationId"
              placeholder="1"
              required
              minLength={1}
              defaultValue={state.values?.applicationId}
              {...props}
            />
          )}
        </Field>

        <Field label="Provider type">
          {(props) => (
            <Input
              name="providerType"
              placeholder="application"
              required
              minLength={1}
              defaultValue={state.values?.providerType}
              {...props}
            />
          )}
        </Field>

        <Field label="Provider">
          {(props) => (
            <Input
              name="providerId"
              placeholder="1"
              required
              minLength={1}
              defaultValue={state.values?.providerId}
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
