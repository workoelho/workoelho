"use server";

import * as superstruct from "superstruct";

import { ActionContext, hasMembershipTo } from "~/src/lib/server/action";
import prisma from "~/src/lib/server/prisma";
import * as Schema from "~/src/lib/shared/schema";

export async function list({ data, session }: ActionContext) {
  superstruct.assert(
    data,
    superstruct.object({
      organizationId: Schema.id,
    }),
  );

  if (!hasMembershipTo(session, data.organizationId)) {
    throw new Error("Unauthorized");
  }

  return await prisma.membership.findMany({
    where: {
      organizationId: data.organizationId,
    },
    include: {
      user: true,
    },
  });
}
