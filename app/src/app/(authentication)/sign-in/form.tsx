"use client";

import { type Session } from "@prisma/client";
import { redirect } from "next/navigation";
import { FormEvent } from "react";

import { Alert } from "~/components/Alert";
import { Field } from "~/components/Field";
import { Flex } from "~/components/Flex";
import { Input } from "~/components/Input";
import { Link } from "~/components/Link";
import { Submit } from "~/components/Submit";
import { request } from "~/lib/client/api";
import { useAsync } from "~/lib/client/useAsync";

type Props = {};

export function Form() {
  const { error, state, execute } = useAsync((data: FormData) =>
    request<Session>("/api/v1/sessions", { method: "post", data })
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const response = await execute(data);
    if (response) {
      const {
        user: {
          memberships: [{ organizationId }],
        },
      } = await response.json();
      redirect(`/${organizationId}/summary`);
    }
  };

  return (
    <Flex as="form" direction="column" gap="1.5rem" onSubmit={handleSubmit}>
      <Flex as="fieldset" direction="column" gap="1.5rem">
        <legend hidden>Sign in</legend>

        <p>
          Haven't signed up yet? <Link href="/sign-up">Try it, free</Link>.
        </p>

        {error ? (
          <Alert variant="negative">
            <pre>{error.toString()}</pre>
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
        <Submit variant="primary" loading={state === "loading"}>
          Sign in
        </Submit>
      </Flex>
    </Flex>
  );
}
