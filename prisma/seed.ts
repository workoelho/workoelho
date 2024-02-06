import { PrismaClient } from "@prisma/client";

import { createPassword } from "~/src/shared/password";

const prisma = new PrismaClient();

try {
  const workoelho = await prisma.organization.create({
    data: {
      name: "Workoelho",
    },
  });
  await prisma.user.create({
    data: {
      name: "Arthur",
      email: "arthur@workoelho.com",
      password: await createPassword("123456"),
      organizationId: workoelho.id,
    },
  });
} finally {
  await prisma.$disconnect();
}
