import type { Context, Id } from "~/src/shared/database";
import {
  database,
  getInsertValues,
  getPrefixedBindings,
} from "~/src/shared/database";

export type Organization = {
  id: Id;
  createdAt: Date;
  updatedAt: Date;
  name: string;
};

export function migrate() {
  database()
    .query(
      `
        create table if not exists organizations (
            id integer primary key,
            createdAt text not null,
            updatedAt text not null,
            name text not null
        );
      `
    )
    .run();
}

export function create(context: Context<Pick<Organization, "name">>) {
  const now = new Date();

  const payload = {
    ...context.payload,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  const organization = database()
    .query<Organization, any>(
      `insert into organizations ${getInsertValues(payload)} returning *;`
    )
    .get(...getPrefixedBindings(payload));

  return organization;
}