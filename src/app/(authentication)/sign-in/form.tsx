"use client";

import { useFormState } from "react-dom";

import { Alert } from "~/src/components/Alert";
import { Field } from "~/src/components/Field";
import { Flex } from "~/src/components/Flex";
import { Icon } from "~/src/components/Icon";
import { Input } from "~/src/components/Input";
import { Link } from "~/src/components/Link";
import { Submit } from "~/src/components/Submit";
import { Props } from "~/src/lib/shared/form";

export function Form({ action, initialState }: Props) {
  const [state, dispatch] = useFormState(action, initialState);

  return (
    <Flex as="form" action={dispatch} direction="column" gap="3rem">
      {state.message ? (
        <Alert variant="negative">
          <p>{state.message}</p>
        </Alert>
      ) : null}

      <Flex as="fieldset" direction="column" gap="1rem">
        <Field label="Email">
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

        <Field
          label="Password"
          hint={
            <>
              Forgot your password? Go to{" "}
              <Link href="/recovery">access recovery</Link>.
            </>
          }
        >
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

      <Flex as="footer" justifyContent="end">
        <Submit>
          Sign in <Icon variant="arrow-right" />
        </Submit>
      </Flex>
    </Flex>
  );
}
