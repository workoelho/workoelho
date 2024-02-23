"use client";

import { useFormState } from "react-dom";

import { Alert } from "~/src/components/Alert";
import { Field } from "~/src/components/Field";
import { Flex } from "~/src/components/Flex";
import { Input } from "~/src/components/Input";
import { Submit } from "~/src/components/Submit";

type State = { message: string; payload: { email: string; name: string } };

type Props = {
  action: (state: Awaited<State>, payload: FormData) => Promise<State>;
  initialState: Awaited<State>;
};

export function Form({ action, initialState }: Props) {
  const [state, dispatch] = useFormState(action, initialState);

  return (
    <Flex as="form" action={dispatch} direction="column" gap="3rem">
      {state.message ? (
        <Alert variant="neutral">
          <p>{state.message}</p>
        </Alert>
      ) : null}

      <Flex as="fieldset" direction="column" gap="1rem">
        <Field label="Name">
          {(props) => (
            <Input
              name="name"
              defaultValue={state.payload.name}
              required
              placeholder="Jane Doe"
              minLength={1}
              {...props}
            />
          )}
        </Field>

        <Field label="E-mail">
          {(props) => (
            <Input
              type="email"
              name="email"
              defaultValue={state.payload.email}
              placeholder="jane@example.com"
              required
              autoComplete="username"
              {...props}
            />
          )}
        </Field>
      </Flex>

      <Flex as="footer" justifyContent="end">
        <Submit>Save</Submit>
      </Flex>
    </Flex>
  );
}
