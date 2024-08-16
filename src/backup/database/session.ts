import type { Id } from "~/src/database/shared";
import { createId, execute } from "~/src/database/shared";
import type { Query } from "~/src/shared/sql";
import { getUpdateSet } from "~/src/shared/sql";

/**
 * Session record.
 */
export type Session = {
	id: Id;
	createdAt: Date;
	updatedAt: Date;
	expiresAt: Date;
	organizationId: Id;
	userId: Id;
};

/**
 * Migrate the table.
 */
export async function migrate() {
	execute(`
		CREATE TABLE IF NOT EXISTS sessions (
			id TEXT PRIMARY KEY,
			createdAt DATETIME NOT NULL,
			updatedAt DATETIME NOT NULL,
			expiresAt DATETIME NOT NULL,
			organizationId TEXT REFERENCES organizations(id),
			userId TEXT REFERENCES users(id)
		)
	`);
}

/**
 * Validate the record.
 */
export async function validate(data: Session) {
	return true;
}

/**
 * Create a new record.
 */
export async function create({
	select = "*",
	data,
}: Query & { data: Pick<Session, "expiresAt" | "organizationId" | "userId"> }) {
	const now = new Date();

	const result = await execute(
		`
			INSERT INTO sessions (id, createdAt, updatedAt, expiresAt, organizationId, userId)
			VALUES ($id, $createdAt, $updatedAt, $expiresAt, $organizationId, $userId)
			RETURNING ${select}
		`,
		{
			id: createId(),
			createdAt: now,
			updatedAt: now,
			expiresAt: data.expiresAt,
			organizationId: data.organizationId,
			userId: data.userId,
		},
	);

	return result[0] as Session;
}

/**
 * Get one record.
 */
export async function get({
	select = "*",
	where = "TRUE",
	tail = "",
	parameters,
}: Query) {
	const result = await execute<Session>(
		`
			SELECT ${select}
			FROM sessions
			WHERE ${where}
			${tail}
			LIMIT 1
		`,
		parameters,
	);

	return result;
}

/**
 * List many records.
 */
export async function list({
	select = "*",
	where = "TRUE",
	tail = "ORDER BY expiresAt ASC, createdAt DESC",
	page = 1,
	size = 10,
	parameters,
}: Query) {
	const result = await execute<Session>(
		`
			SELECT ${select}
			FROM sessions
			WHERE ${where}
			${tail}
			LIMIT ${size} OFFSET ${size * page - size}
		`,
		parameters,
	);

	return result;
}

/**
 * Update one or more records.
 */
export async function update({
	select = "*",
	where = "id = $id",
	data,
	parameters
}: Query & { data: Partial<Session> }) {
	const result = await execute<Session>(
		`
			UPDATE sessions
			SET ${getUpdateSet(data)}
			${where}
			RETURNING ${select}
		`,
		{...data, ...parameters},
	);

	return result;
}

/**
 * Delete one or more records.
 */
export async function destroy({
	select = "*",
	where = "id = $id",
	parameters,
}: Query) {
	const result = await execute<Session>(
		`
			DELETE FROM sessions
			WHERE ${where}
			RETURNING ${select}
		`,
		parameters,
	);

	return result[0];
}
