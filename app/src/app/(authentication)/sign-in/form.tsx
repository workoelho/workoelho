"use client";

import { useFormState } from "react-dom";

import { Alert } from "~/src/components/Alert";
import { Field } from "~/src/components/Field";
import { Flex } from "~/src/components/Flex";
import { Input } from "~/src/components/Input";
import { Link } from "~/src/components/Link";
import { Submit } from "~/src/components/Submit";

type Props<T> = {
  action: (state: Awaited<T>, payload: FormData) => Promise<T> | never;
  initialState: Awaited<T>;
};

export function Form<T extends { message: string }>({
  action,
  initialState,
}: Props<T>) {
  const [state, dispatch] = useFormState(action, initialState);

  return (
    <Flex as="form" action={dispatch} direction="column" gap="1.5rem">
      <Flex as="fieldset" direction="column" gap="1.5rem">
        <legend hidden>Sign in</legend>

        <p>
          Haven't signed up yet? <Link href="/sign-up">Try it, free</Link>.
        </p>

        {state.message ? (
          <Alert variant="negative">
            <p>{state.message}</p>
          </Alert>
        ) : null}

        <Flex direction="column" gap="0.75rem">
          <Field label="E-mail">
            {(props) => (
              <Input
                name="email"
                type="email"
                placeholder="jane@example.com"
                required
                autoComplete="username"
                {...props}
              />
            )}
          </Field>

          <Field label="Password" hint={<Link href="/">Need help?</Link>}>
            {(props) => (
              <Input
                name="password"
                type="password"
                placeholder="⁕⁕⁕⁕⁕⁕⁕⁕⁕⁕⁕⁕⁕⁕⁕"
                minLength={15}
                required
                autoComplete="current-password"
                {...props}
              />
            )}
          </Field>
        </Flex>
      </Flex>

      <Flex justifyContent="end">
        <Submit variant="primary" size="large">
          Sign in
        </Submit>
      </Flex>
    </Flex>
  );
}