"use client";

import { useFormState } from "react-dom";
import { Alert } from "~/components/Alert";
import { Field } from "~/components/Field";
import { Flex } from "~/components/Flex";
import { Heading } from "~/components/Heading";
import { Input } from "~/components/Input";
import { Submit } from "~/components/Submit";

type Props<T> = {
  action: (state: T, payload: FormData) => never | Promise<T>;
  initialState: T;
};

export function Form<T extends { message: string }>({
  action,
  initialState,
}: Props<T>) {
  const [state, handledAction] = useFormState(action, initialState);

  return (
    <Flex as="form" action={handledAction} flexDirection="column" gap="1.5rem">
      <Flex as="fieldset" flexDirection="column" gap="1.5rem">
        <Heading as="legend" level={2}>
          Sign in
        </Heading>

        <p>Welcome, back! 👋</p>

        {state.message ? (
          <Alert variant="negative">
            <p>{state.message}</p>
          </Alert>
        ) : null}

        <Field label="E-mail">
          {(props) => <Input name="email" type="email" required {...props} />}
        </Field>

        <Field label="Password">
          {(props) => (
            <Input name="password" type="password" required {...props} />
          )}
        </Field>
      </Flex>

      <footer>
        <Submit>Sign in</Submit>
      </footer>
    </Flex>
  );
}
