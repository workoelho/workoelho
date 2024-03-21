import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { Flex } from "~/src/components/Flex";
import { Heading } from "~/src/components/Heading";
import { Link } from "~/src/components/Link";
import * as Sessions from "~/src/feats/session/api";
import * as Users from "~/src/feats/user/api";
import { getDeviceId } from "~/src/lib/server/deviceId";
import { getRemoteAddress } from "~/src/lib/server/remoteAddress";
import { getRequestSession, setSessionCookie } from "~/src/lib/server/session";
import { UnauthorizedError } from "~/src/lib/shared/errors";
import { getFormProps } from "~/src/lib/shared/form";
import { getUrl } from "~/src/lib/shared/url";

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
  let session = await getRequestSession();

  if (!session) {
    session = await Sessions.get({
      payload: {
        id: sessionId,
      },
    });
  }

  if (!session) {
    throw new UnauthorizedError();
  }

  // If the session ID came in the URL we have to refresh it.
  if (sessionId) {
    session = await Sessions.refresh({
      payload: {
        sessionId,
        deviceId: getDeviceId(cookies()),
        userAgent: headers().get("user-agent"),
        remoteAddress: getRemoteAddress(),
      },
    });

    setSessionCookie(session);
  }

  const form = getFormProps(async (state, form) => {
    "use server";

    const session = await getRequestSession();

    if (!session) {
      throw new UnauthorizedError();
    }

    await Users.update({
      payload: { id: session.user.id, password: form.get("password") },
    });

    redirect(getUrl(session.organization, "summary"));
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
