"use client";

import { useFormState } from "react-dom";

import {
  type Session,
  type User,
  type Organization,
} from "~/src/lib/server/prisma";
import { Alert } from "~/src/components/Alert";
import { Field } from "~/src/components/Field";
import { Flex } from "~/src/components/Flex";
import { Heading } from "~/src/components/Heading";
import { Input } from "~/src/components/Input";
import { Submit } from "~/src/components/Submit";
import { Nullable } from "~/src/lib/shared/nullable";
import { session } from "~/src/lib/shared/schema";
import { Link } from "~/src/components/Link";
import { getUrl } from "~/src/lib/shared/url";

type Props<T> = {
  action: (state: Awaited<T>, payload: FormData) => Promise<T> | never;
  initialState: Awaited<T>;
  session: Session & { user: User & { organization: Organization } };
};

export function Form<T extends { message: string }>({
  action,
  initialState,
  session,
}: Props<T>) {
  const [state, dispatch] = useFormState(action, initialState);

  return (
    <Flex as="form" action={dispatch} direction="column" gap="3rem">
      <Flex as="fieldset" direction="column" gap="3rem">
        <Flex direction="column" gap="1rem" style={{ textAlign: "center" }}>
          <Heading as="legend" size="large">
            Reset password
          </Heading>

          <p>
            Changing password of <strong>{session.user.email}</strong>.
            Alternatively you may wish to go back to{" "}
            <Link href="/profile">my profile</Link> or{" "}
            <Link
              href={getUrl(
                "organizations",
                session.user.organization,
                "summary"
              )}
            >
              my organization
            </Link>
          </p>
        </Flex>

        {state.message ? (
          <Alert variant="negative">
            <p>{state.message}</p>
          </Alert>
        ) : null}

        <Flex direction="column" gap="1rem">
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
        <Submit>Reset</Submit>
      </Flex>
    </Flex>
  );
}
