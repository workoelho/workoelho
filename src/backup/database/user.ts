import type { Id } from "~/src/database/shared";
import type { Query } from "~/src/shared/sql";
import * as database from "~/src/database/shared";
import { hash } from "~/src/shared/password";
import { getInsertValues, getLimitOffset, getUpdateSet, prefix } from "~/src/shared/sql";
import { Organization } from "~/src/database/organization";
import type { Unkrec } from "~/src/shared/type";

/**
 * User record.
 */
export type User = {
	id: Id;
	createdAt: Date;
	updatedAt: Date;
	organizationId: Id;
	name: string;
	email: string;
	password: string;
}

/**
 * Migrate the table.
 */
export async function migrate() {
	await database.run(`
		create table if not exists users (
			id text primary key,
			createdAt text not null,
			updatedAt text not null,
			organizationId text references organizations(id),
			name text not null,
			email text not null unique,
			password text not null,
		)
	`);
}

/**
 * Validate the record.
 */
export async function validate(data: Partial<User>) {
	return true;
}

/**
 * Create a new record.
 */
export async function create(input: Pick<User, "organizationId" | "name" | "email" | "password">) {
	const now = new Date();

	const data = {
		...input,

		id: database.createId(),
		createdAt: now,
		updatedAt: now,
		password: await hash(input.password),
	}

	return await database.get<User>(
		`
			insert into users
			${getInsertValues(data)}
			returning *
		`,
		data
	);
}

/**
 * Get one record.
 */
export async function get({
	where = "id = $id",
	order = "createdAt desc",
	params,
}: { where?: string, order?: string, params: Unkrec}) {
	return await database.get<User>(
		`
			select *
			from users
			where ${where}
			order by ${order}
			limit 1
		`,
		params,
	);
}

/**
 * List many records.
 */
export async function list({
	select = "*",
	where = "true",
	order = "createdAt desc, id desc",
	group = "",
	page = 1,
	size = 10,
	params,
}: Query) {
	return await database.all<User[]>(
		`
			select ${select}
			from users
			where ${where}
			${prefix("order by", order)}
			${prefix("group by", group)}
			${getLimitOffset(page, size)}
		`,
		params,
	);
}

/**
 * Update one record.
 */
export async function update({
	select = "*",
	where = "id = $id",
	data,
	params,
}: Query & { data: Partial<User> }) {
	data.updatedAt ??= new Date();

	if (data.password) {
		data.password = await hash(data.password);
	}

	return await database.get<User>(
		`
			update users
			set ${getUpdateSet(data)}
			where ${where}
			returning ${select}
		`,
		{ ...data, ...params },
	);
}

/**
 * Trash one or more records.
 */
export async function trash(predicate = "id = $id") {
	return await database.get<User>(
		`
			update users
			set deletedAt = $now
			where ${predicate}
			returning *
		`,
		{ now: new Date() },
	);
}
