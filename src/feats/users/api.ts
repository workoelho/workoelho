import * as Bun from "bun";
import { z } from "zod";

import type { Bindings, Context } from "~/src/shared/database";
import {
  database,
  getInsertValues,
  getPrefixedBindings,
} from "~/src/shared/database";
import { Email, Id, Name } from "~/src/shared/schema";

export const User = z.object({
  id: Id,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  organizationId: Id,
  name: Name,
  email: Email,
  password: z.string().min(15),
});

export type User = z.infer<typeof User>;

export function migrate() {
  database()
    .query(
      `
        create table if not exists users (
          id integer primary key,
          createdAt text not null,
          updatedAt text not null,
          organizationId references organizations(id),
          name text not null,
          email text not null,
          password text not null
        );
      `,
    )
    .run();
}

export const password = {
  hash(password: string) {
    return Bun.password.hash(password);
  },

  verify(password: string, hash: string) {
    return Bun.password.verify(password, hash);
  },
};

export async function create(
  context: Context<
    Pick<User, "organizationId" | "name" | "email" | "password">
  >,
) {
  const createdAt = new Date().toISOString();

  const data = User.omit({ id: true }).parse({
    ...context.payload,
    createdAt,
    updatedAt: createdAt,
  });

  data.password = await password.hash(data.password);

  const user = database()
    .query<User, Bindings>(
      `insert into users ${getInsertValues(data)} returning *;`,
    )
    .get(getPrefixedBindings(data));

  if (!user) {
    throw new Error("Query failed");
  }

  return user;
}
