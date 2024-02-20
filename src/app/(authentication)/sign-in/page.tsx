import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";

import { authenticate, create } from "~/src/actions/session";
import { getPublicId } from "~/src/lib/shared/publicId";
import { setSessionCookie } from "~/src/lib/server/session";
import { getDeviceId, setDeviceId } from "~/src/lib/server/device";
import { getRemoteAddress } from "~/src/lib/server/remoteAddress";

import { Form } from "./form";

export const metadata: Metadata = {
  title: "Sign in at Workoelho",
};

export default async function Page() {
  const action = async (state: { message: string }, payload: FormData) => {
    "use server";

    const session = await authenticate({
      payload: {
        email: payload.get("email"),
        password: payload.get("password"),
        deviceId: getDeviceId(cookies()),
        userAgent: headers().get("user-agent"),
        remoteAddress: getRemoteAddress(),
      },
    });

    setSessionCookie(session);

    const organizationId = getPublicId(session.user.organizationId);

    redirect(`/organizations/${organizationId}/summary`);
  };

  return <Form action={action} initialState={{ message: "" }} />;
}
