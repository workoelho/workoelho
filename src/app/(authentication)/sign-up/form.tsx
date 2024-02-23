"use client";

import { useFormState } from "react-dom";

import { Alert } from "~/src/components/Alert";
import { Field } from "~/src/components/Field";
import { Flex } from "~/src/components/Flex";
import { Heading } from "~/src/components/Heading";
import { Icon } from "~/src/components/Icon";
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
    <Flex as="form" action={dispatch} direction="column" gap="3rem">
      <Flex as="fieldset" direction="column" gap="3rem">
        <Flex direction="column" gap="1rem">
          <Heading as="legend" size="large">
            Sign up
          </Heading>
          <p>
            Already signed up? <Link href="/sign-in">Sign in, instead</Link>.
          </p>
        </Flex>

        {state.message ? (
          <Alert variant="negative">
            <p>{state.message}</p>
          </Alert>
        ) : null}

        <Flex direction="column" gap="1rem">
          <Field label="Organization" hint="Name of your team or company.">
            {(props) => (
              <Input
                name="organization"
                required
                placeholder="ACME Inc."
                minLength={1}
                {...props}
              />
            )}
          </Field>

          <Field label="Name">
            {(props) => (
              <Input
                name="name"
                required
                placeholder="Jane Doe"
                minLength={1}
                {...props}
              />
            )}
          </Field>

          <Field label="E-mail" hint="Your work e-mail.">
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

          <Field label="Password" hint="At least 15 characters long.">
            {(props) => (
              <Input
                name="password"
                type="password"
                placeholder="⁕⁕⁕⁕⁕⁕⁕⁕⁕⁕⁕⁕⁕⁕⁕"
                minLength={15}
                required
                autoComplete="new-password"
                {...props}
              />
            )}
          </Field>
        </Flex>
      </Flex>

      <Flex justifyContent="end">
        <Submit>
          Sign up
          <Icon variant="arrow-right" />
        </Submit>
      </Flex>
    </Flex>
  );
}
