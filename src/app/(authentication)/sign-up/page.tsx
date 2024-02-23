import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { create as createOrganization } from "~/src/actions/organization";
import { create as createSession } from "~/src/actions/session";
import { setSessionCookie } from "~/src/lib/server/session";
import { getRemoteAddress } from "~/src/lib/server/remoteAddress";
import { getDeviceId } from "~/src/lib/server/deviceId";
import { getUrl } from "~/src/lib/shared/url";

import { Form } from "./form";

export const metadata: Metadata = {
  title: "Sign up at Workoelho",
};

export default async function Page() {
  const action = async (state: { message: string }, payload: FormData) => {
    "use server";

    const organization = await createOrganization({
      payload: {
        name: payload.get("name"),
        organization: payload.get("organization"),
        email: payload.get("email"),
        password: payload.get("password"),
      },
    });

    const session = await createSession({
      payload: {
        userId: organization.users[0].id,
        remoteAddress: getRemoteAddress(),
        userAgent: headers().get("user-agent"),
        deviceId: getDeviceId(cookies()),
      },
    });

    setSessionCookie(session);

    redirect(getUrl("organizations", organization, "summary"));
  };

  return <Form action={action} initialState={{ message: "" }} />;
}
