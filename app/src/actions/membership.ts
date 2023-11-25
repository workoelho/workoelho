"use server";

import * as superstruct from "superstruct";

import { Context } from "~/src/lib/server/actions";
import prisma from "~/src/lib/server/prisma";
import { hasMembershipTo } from "~/src/lib/server/session";
import * as Schema from "~/src/lib/shared/schema";

export async function list({ query, session }: Context) {
  superstruct.assert(
    query,
    superstruct.object({
      organizationId: Schema.id,
    })
  );

  if (!hasMembershipTo(session, query.organizationId)) {
    throw new Error("Unauthorized");
  }

  return await prisma.membership.findMany({
    where: {
      organizationId: query.organizationId,
    },
    include: {
      user: true,
    },
  });
}
