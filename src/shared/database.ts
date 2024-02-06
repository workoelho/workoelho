import { PrismaClient } from "@prisma/client";
export type * from "@prisma/client";

export const database = new PrismaClient();
