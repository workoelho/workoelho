import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import * as Organizations from "~/src/feats/organizations/api";
import * as Sessions from "~/src/feats/sessions/api";
import { setSessionCookie } from "~/src/lib/server/session";
import { getRemoteAddress } from "~/src/lib/server/remoteAddress";
import { getDeviceId } from "~/src/lib/server/deviceId";
import { getUrl } from "~/src/lib/shared/url";
import { Link } from "~/src/components/Link";
import { Flex } from "~/src/components/Flex";
import { Heading } from "~/src/components/Heading";
import { getFormProps } from "~/src/lib/shared/form";

import { Form } from "./form";

export const metadata: Metadata = {
  title: "Sign up at Workoelho",
};

export default async function Page() {
  const form = getFormProps(async (state, payload) => {
    "use server";

    const organization = await Organizations.create({
      payload: {
        name: payload.get("name"),
        organization: payload.get("organization"),
        email: payload.get("email"),
        password: payload.get("password"),
      },
    });

    const session = await Sessions.create({
      payload: {
        organizationId: organization.id,
        userId: organization.users[0].id,
        remoteAddress: getRemoteAddress(),
        userAgent: headers().get("user-agent"),
        deviceId: getDeviceId(cookies()),
      },
    });

    setSessionCookie(session);

    redirect(getUrl(organization, "summary"));
  });

  return (
    <>
      <Flex direction="column" gap="1rem">
        <Heading as="h2" size="large">
          Sign up
        </Heading>

        <p>
          Already signed up? <Link href="/sign-in">Sign in, instead</Link>.
        </p>
      </Flex>

      <Form {...form} />
    </>
  );
}
