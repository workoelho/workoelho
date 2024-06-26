import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import * as superstruct from "superstruct";

import { send } from "~/src/emails/recovery";
import * as Sessions from "~/src/feats/session/api";
import * as Users from "~/src/feats/user/api";
import { getDeviceId } from "~/src/lib/server/deviceId";
import { getRemoteAddress } from "~/src/lib/server/remoteAddress";
import { getFormProps } from "~/src/lib/server/form";
import * as schema from "~/src/lib/shared/schema";
import { getUrl } from "~/src/lib/shared/url";
import { Container } from "~/src/components/Container";
import { Flex } from "~/src/components/Flex";
import { Header } from "~/src/components/Header";
import { Link } from "~/src/components/Link";

import { Form } from "./form";

export const metadata: Metadata = {
  title: "Recovery at Workoelho",
};

export default async function Page() {
  const form = getFormProps(async (state, form) => {
    "use server";

    const user = await Users.getByEmail({
      payload: {
        email: superstruct.create(form.get("email"), schema.email),
      },
    });

    const session = await Sessions.create({
      payload: {
        organizationId: user.organizationId,
        userId: user.id,
        deviceId: getDeviceId(cookies()),
        remoteAddress: getRemoteAddress(),
        userAgent: headers().get("user-agent"),
      },
    });

    await send({ session });

    redirect(getUrl("recovery", "result"));
  });

  return (
    <Container size="medium" padding="3rem">
      <Flex direction="column" gap="3rem">
        <Header
          title="Recovery"
          description={
            <p>
              Remembered your password? Go{" "}
              <Link href="/sign-in">back to sign in</Link>.
            </p>
          }
        />

        <Form {...form} />
      </Flex>
    </Container>
  );
}
