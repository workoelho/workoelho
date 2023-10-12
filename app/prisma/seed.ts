import { Prisma, PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

const administrator: Prisma.UserCreateInput = {
  name: "Administrator",
  email: "administrator@localhost",
  password: "",
};

async function main() {
  administrator.password = await hash("123", 10);

  await prisma.user.create({
    data: administrator,
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
