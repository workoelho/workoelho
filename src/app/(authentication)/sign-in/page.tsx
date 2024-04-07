import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import * as Sessions from "~/src/feats/session/api";
import { getDeviceId } from "~/src/lib/server/deviceId";
import { getRemoteAddress } from "~/src/lib/server/remoteAddress";
import { setSessionCookie } from "~/src/lib/server/session";
import { getUrl } from "~/src/lib/shared/url";
import { Flex } from "~/src/components/Flex";
import { Link } from "~/src/components/Link";
import { Container } from "~/src/components/Container";
import { getFormProps } from "~/src/lib/shared/form";
import { Header } from "~/src/components/Header";

import { Form } from "./form";

export const metadata: Metadata = {
  title: "Sign in at Workoelho",
};

export default async function Page() {
  const form = getFormProps(async (state, payload) => {
    "use server";

    const session = await Sessions.authenticate({
      payload: {
        email: payload.get("email"),
        password: payload.get("password"),
        deviceId: getDeviceId(cookies()),
        userAgent: headers().get("user-agent"),
        remoteAddress: getRemoteAddress(),
      },
    });

    setSessionCookie(session);

    redirect(getUrl(session.organization, "summary"));
  });

  return (
    <Container size="medium" padding="3rem">
      <Flex direction="column" gap="3rem">
        <Header
          title="Sign in"
          description={
            <p>
              Haven't signed up yet? <Link href="/sign-up">Try it, free</Link>.
            </p>
          }
        />

        <Form {...form} />
      </Flex>
    </Container>
  );
}
