"use client";

import { useFormState } from "react-dom";

import { Alert } from "~/components/Alert";
import { Field } from "~/components/Field";
import { Flex } from "~/components/Flex";
import { Heading } from "~/components/Heading";
import { Input } from "~/components/Input";
import { Link } from "~/components/Link";
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
    <Flex as="form" action={handledAction} direction="column" gap="1.5rem">
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
        <Submit size="large" variant="primary">
          Sign in
        </Submit>
      </Flex>
    </Flex>
  );
}
