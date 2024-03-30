import { Prisma, PrismaClient } from "@prisma/client";
export * from "@prisma/client";
export { Prisma } from "@prisma/client";

declare const global: { prisma: PrismaClient };

const logExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    query: {
      $allModels: {
        async $allOperations({ operation, model, args, query }) {
          performance.mark("query");
          const result = await query(args);
          const { duration } = performance.measure("query", "query");

          console.log("prisma", { model, operation, args, duration });

          return result;
        },
      },
    },
  });
});

const brandExtension = Prisma.defineExtension((client) => {
  const result = Object.fromEntries(
    Object.keys(client)
      .filter((key) => !key.startsWith("$"))
      .map((key) => [key, { $type: { needs: {}, compute: () => key } }]),
  );

  return client.$extends({ result });
});

export const db = global.prisma ?? new PrismaClient().$extends(brandExtension);

if (process.env.NODE_ENV !== "production") {
  global.prisma = db;
}
