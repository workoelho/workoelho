"use client";

import { useFormState } from "react-dom";

import { Alert } from "~/src/components/Alert";
import { Field } from "~/src/components/Field";
import { Flex } from "~/src/components/Flex";
import { Input } from "~/src/components/Input";
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

      <Field
        label="Name"
        hint="Could be a website, a mobile application, a front-end, a microservice, etc."
      >
        {(props) => (
          <Input
            name="name"
            required
            placeholder="Web application"
            minLength={1}
            autoComplete="off"
            {...props}
          />
        )}
      </Field>

      <Flex as="footer" justifyContent="end">
        <Submit>Create application</Submit>
      </Flex>
    </Flex>
  );
}
