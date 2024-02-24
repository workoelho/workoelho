import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";

import { getValidSession, setSessionCookie } from "~/src/lib/server/session";
import { update } from "~/src/actions/user";
import { UnauthorizedError } from "~/src/lib/shared/errors";
import { refresh } from "~/src/actions/session/refresh";
import { getDeviceId } from "~/src/lib/server/deviceId";
import { getRemoteAddress } from "~/src/lib/server/remoteAddress";
import { getUrl } from "~/src/lib/shared/url";
import { Flex } from "~/src/components/Flex";
import { Heading } from "~/src/components/Heading";
import { Link } from "~/src/components/Link";
import { getFormProps } from "~/src/lib/shared/form";

import { Form } from "./form";

export const metadata: Metadata = {
  title: "Reset password at Workoelho",
};

type Props = {
  searchParams: {
    sessionId: string;
  };
};

export default async function Page({ searchParams: { sessionId } }: Props) {
  let session = await getValidSession(sessionId);

  if (!session) {
    throw new UnauthorizedError();
  }

  // If the session ID came in the URL we have to refresh it.
  if (sessionId) {
    session = await refresh({
      query: { sessionId },
      payload: {
        deviceId: getDeviceId(cookies()),
        userAgent: headers().get("user-agent"),
        remoteAddress: getRemoteAddress(),
      },
    });

    setSessionCookie(session);
  }

  const form = getFormProps(async (state, form) => {
    "use server";

    const session = await getValidSession();

    if (!session) {
      throw new UnauthorizedError();
    }

    await update({
      query: { id: session.user.id },
      payload: { password: form.get("password") },
    });

    redirect(getUrl("organizations", session.user.organizationId, "summary"));
  });

  return (
    <>
      <Flex direction="column" gap="1rem">
        <Heading as="h2" size="large">
          Reset password
        </Heading>

        <p>
          Changing password for <strong>{session.user.email}</strong>.
        </p>

        <p>
          You may go back to <Link href={getUrl("profile")}>my profile</Link> or{" "}
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
