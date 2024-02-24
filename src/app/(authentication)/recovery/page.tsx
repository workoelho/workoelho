import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import * as superstruct from "superstruct";

import * as schema from "~/src/lib/shared/schema";
import { create } from "~/src/actions/session";
import { getDeviceId } from "~/src/lib/server/deviceId";
import { getRemoteAddress } from "~/src/lib/server/remoteAddress";
import { db } from "~/src/lib/server/prisma";
import { getFormProps } from "~/src/lib/shared/form";
import { send } from "~/src/emails/recovery";
import { getUrl } from "~/src/lib/shared/url";

import { Form } from "./form";

export const metadata: Metadata = {
  title: "Recovery at Workoelho",
};

export default async function Page() {
  const form = getFormProps(async (state, form) => {
    "use server";

    const user = await db.user.findUniqueOrThrow({
      where: {
        email: superstruct.create(form.get("email"), schema.email),
      },
    });

    const session = await create({
      payload: {
        userId: user.id,
        deviceId: getDeviceId(cookies()),
        remoteAddress: getRemoteAddress(),
        userAgent: headers().get("user-agent"),
      },
    });

    await send({ session });

    redirect(getUrl("recovery", "result"));
  });

  return <Form {...form} />;
}
