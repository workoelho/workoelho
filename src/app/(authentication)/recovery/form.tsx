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
import { Props, State } from "~/src/lib/shared/form";

export function Form(props: Props<State>) {
  const [state, action] = useFormState(props.action, props.initialState);

  return (
    <Flex as="form" action={action} direction="column" gap="3rem">
      <Flex as="fieldset" direction="column" gap="3rem">
        <Flex direction="column" gap="1rem">
          <Heading as="legend" size="large">
            Recovery
          </Heading>

          <p>
            Enter your registered email. If you remember your password, you may
            go <Link href="/sign-in">back to sign in</Link>.
          </p>
        </Flex>

        {state.message ? (
          <Alert variant="negative">
            <p>{state.message}</p>
          </Alert>
        ) : null}

        <Flex direction="column" gap="1rem">
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
        </Flex>
      </Flex>

      <Flex justifyContent="end">
        <Submit>
          Recover <Icon variant="arrow-right" />
        </Submit>
      </Flex>
    </Flex>
  );
}
