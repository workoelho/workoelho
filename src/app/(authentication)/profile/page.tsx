import type { Metadata } from "next";
import * as superstruct from "superstruct";

import { getValidSession } from "~/src/lib/server/session";
import { getFormProps } from "~/src/lib/shared/form";
import { UnauthorizedError } from "~/src/lib/shared/errors";
import { update } from "~/src/actions/user/update";
import { Flex } from "~/src/components/Flex";
import { Heading } from "~/src/components/Heading";
import { getUrl } from "~/src/lib/shared/url";
import { Link } from "~/src/components/Link";
import * as schema from "~/src/lib/shared/schema";

import { Form } from "./form";

export const metadata: Metadata = {
  title: "My profile at Workoelho",
};

export default async function Page() {
  const session = await getValidSession();

  if (!session) {
    throw new UnauthorizedError();
  }

  const form = getFormProps(
    async (state, form) => {
      "use server";

      const session = await getValidSession();

      if (!session) {
        throw new UnauthorizedError();
      }

      const payload = superstruct.create(
        {
          id: session.user.id,
          name: form.get("name"),
          email: form.get("email"),
        },
        superstruct.object({
          id: schema.id,
          name: superstruct.string(),
          email: superstruct.string(),
        }),
      );

      await update({
        payload,
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
          <Link
            href={getUrl("organizations", session.user.organization, "summary")}
          >
            my organization
          </Link>
          .
        </p>
      </Flex>

      <Form {...form} />
    </>
  );
}
