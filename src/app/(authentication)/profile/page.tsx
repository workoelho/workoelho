import type { Metadata } from "next";

import { getRequestSession, validate } from "~/src/lib/server/session";
import { getFormProps } from "~/src/lib/shared/form";
import { UnauthorizedError } from "~/src/lib/shared/errors";
import { update } from "~/src/feats/users/api/update";
import { Flex } from "~/src/components/Flex";
import { Heading } from "~/src/components/Heading";
import { getUrl } from "~/src/lib/shared/url";
import { Link } from "~/src/components/Link";

import { Form } from "./form";

export const metadata: Metadata = {
  title: "My profile at Workoelho",
};

export default async function Page() {
  const session = await getRequestSession();
  validate(session);

  const form = getFormProps(
    async (state, form) => {
      "use server";

      const session = await getRequestSession();
      validate(session);

      await update({
        payload: {
          id: session.user.id,
          name: form.get("name"),
          email: form.get("email"),
        },
        session,
      });

      return { ...state, message: "Changes saved." };
    },
    {
      values: { name: session.user.name, email: session.user.email },
    },
  );

  return (
    <>
      <Flex direction="column" gap="1rem">
        <Heading as="h2" size="large">
          My profile
        </Heading>

        <p>Update your personal information below.</p>

        <p>
          Go <Link href="/reset">change your password</Link>, or back to{" "}
          <Link href={getUrl(session.organization, "summary")}>
            my organization
          </Link>
          .
        </p>
      </Flex>

      <Form {...form} />
    </>
  );
}
