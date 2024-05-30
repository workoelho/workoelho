import * as Bun from "bun";

import type { Bindings, Context, Id } from "~/src/shared/database";
import {
  database,
  getInsertValues,
  getPrefixedBindings,
} from "~/src/shared/database";

export type User = {
  id: Id;
  createdAt: Date;
  updatedAt: Date;
  organizationId: Id;
  name: string;
  email: string;
  password: string;
};

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
    Pick<User, "name" | "email" | "password" | "organizationId">
  >,
) {
  const now = new Date();

  const data = {
    ...context.payload,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  data.password = await password.hash(data.password);

  const result = database()
    .query<User, Bindings>(
      `insert into users ${getInsertValues(data)} returning *;`,
    )
    .get(getPrefixedBindings(data));

  if (!result) {
    throw new Error("Query failed");
  }

  return result;
}
