import { type Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { signUp } from "~/src/actions/user";
import { getPublicId } from "~/src/lib/shared/publicId";
import { setSession } from "~/src/lib/server/session";
import { getRemoteAddress } from "~/src/lib/server/remoteAddress";
import { getDeviceId } from "~/src/lib/server/device";

import { Form } from "./form";

export const metadata: Metadata = {
  title: "Sign up at Workoelho",
};

export default async function Page() {
  const action = async (state: { message: string }, payload: FormData) => {
    "use server";

    const user = await signUp({
      payload: {
        name: payload.get("name"),
        organization: payload.get("organization"),
        email: payload.get("email"),
        password: payload.get("password"),
        remoteAddress: getRemoteAddress(),
        userAgent: headers().get("user-agent"),
        deviceId: getDeviceId(cookies()),
      },
    });

    setSession(user.sessions[0]);

    redirect(`/org/${getPublicId(user.organizationId)}/summary`);
  };

  return <Form action={action} initialState={{ message: "" }} />;
}
