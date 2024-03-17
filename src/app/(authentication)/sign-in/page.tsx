import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";

import * as Sessions from "~/src/feats/sessions/api";
import { setSessionCookie } from "~/src/lib/server/session";
import { getDeviceId } from "~/src/lib/server/deviceId";
import { getRemoteAddress } from "~/src/lib/server/remoteAddress";
import { getUrl } from "~/src/lib/shared/url";

import { Form } from "./form";

export const metadata: Metadata = {
  title: "Sign in at Workoelho",
};

export default async function Page() {
  const action = async (state: { message: string }, payload: FormData) => {
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
  };

  return <Form action={action} initialState={{ message: "" }} />;
}
