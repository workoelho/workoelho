import * as superstruct from "superstruct";
import type { ObjectSchema } from "superstruct/dist/utils";

/**
 * Id coercing struct.
 */
export const Id = superstruct.coerce(
	superstruct.number(),
	superstruct.string(),
	(value) => Number.parseInt(value, 10),
);

/**
 * Validate and coerce object against schema, returning compatible object but with nullified values on failure.
 */
export function validate<
	T extends Record<string, unknown>,
	S extends ObjectSchema,
>(data: T, schema: S) {
	try {
		return superstruct.create(data, superstruct.object(schema));
	} catch (error) {
		return {} as { [K in keyof T]: null };
	}
}
