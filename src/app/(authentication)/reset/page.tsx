import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";

import { getPublicId } from "~/src/lib/shared/publicId";
import { getValidSession, setSessionCookie } from "~/src/lib/server/session";
import { update } from "~/src/actions/user";
import { UnauthorizedError } from "~/src/lib/shared/errors";
import { refresh } from "~/src/actions/session";
import { getDeviceId } from "~/src/lib/server/device";
import { getRemoteAddress } from "~/src/lib/server/remoteAddress";

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

  if (sessionId) {
    session = await refresh({
      payload: {
        sessionId,
        deviceId: getDeviceId(cookies()),
        userAgent: headers().get("user-agent"),
        remoteAddress: getRemoteAddress(),
      },
    });

    setSessionCookie(session);
  }

  const action = async (state: { message: string }, form: FormData) => {
    "use server";

    const session = await getValidSession();

    if (!session) {
      throw new UnauthorizedError();
    }

    await update({
      query: { id: session.user.id },
      payload: { password: form.get("password") },
    });

    const organizationId = getPublicId(session.user.organizationId);

    redirect(`/organizations/${organizationId}`);
  };

  return (
    <Form action={action} initialState={{ message: "" }} session={session} />
  );
}
