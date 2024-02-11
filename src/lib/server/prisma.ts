import { PrismaClient } from "@prisma/client";
export * from "@prisma/client";

declare const global: { prisma: PrismaClient };

export const db =
  global.prisma ??
  new PrismaClient().$extends({
    query: {
      $allModels: {
        async $allOperations({ operation, model, args, query }) {
          performance.mark("query");
          const result = await query(args);
          const { duration } = performance.measure("query", "query");

          console.log(" i database", { model, operation, args, duration });

          return result;
        },
      },
    },
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = db;
}
