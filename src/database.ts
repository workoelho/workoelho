import { PrismaClient } from "@prisma/client";
export type { Project } from "@prisma/client";

export const database = new PrismaClient();
