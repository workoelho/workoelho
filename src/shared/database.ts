import log from "npmlog";
import { PrismaClient } from "@prisma/client";
export type * from "@prisma/client";

export const database = new PrismaClient().$extends({
  query: {
    $allModels: {
      async $allOperations({ operation, model, args, query }) {
        performance.mark("request");
        const result = await query(args);
        const { duration } = performance.measure("request", "request");

        log.verbose("database", "query", { model, operation, args, duration });

        return result;
      },
    },
  },
});
