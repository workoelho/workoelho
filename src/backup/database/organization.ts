import type { Id } from "~/src/database/shared";
import { execute } from "~/src/database/shared";
import { Column } from "~/src/shared/sql";

export class Organization {
	id!: Id;
	createdAt!: Date;
	updatedAt!: Date;
	name!: string;

	static toString() {
		return "organizations";
	}

	static id = new Column("organizations", "id", "TEXT PRIMARY KEY");
	static createdAt = new Column("organizations", "createdAt", "TEXT NOT NULL");
	static updatedAt = new Column("organizations", "updatedAt", "TEXT NOT NULL");
	static name = new Column("organizations", "name", "TEXT NOT NULL");
}

export async function migrate() {
	await execute(
		`
			CREATE TABLE IF NOT EXISTS ${Organization} (
				${Organization.id.definition},
				${Organization.createdAt.definition},
				${Organization.updatedAt.definition},
				${Organization.name.definition}
			)
		`,
	);
}
