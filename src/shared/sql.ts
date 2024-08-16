import type { Unkrec } from "~/src/shared/type";

/**
 * Get the SQL for the values of an insert query.
 */
export function getInsertValues<T extends Unkrec>(data: T) {
	return `(${Object.keys(data).join(",")}) VALUES (${Object.keys(data)
		.map((name) => `$${name}`)
		.join(",")})`;
}

/**
 * Get the SQL for the field set of an set query.
 */
export function getUpdateSet<T extends Unkrec>(data: T) {
	return Object.keys(data)
		.map((key) => `${key} = $${key}`)
		.join(", ");
}

/**
 * Get the SQL for pagination using limit/offset.
 */
export function getLimitOffset(page: number, size = 10) {
	return `limit ${size} offset ${size * page - size}`;
}

/**
 * Get prefixed value, if value is not empty.
 */
export function prefix(prefix: string, value: string) {
	if (value === "") {
		return "";
	}
	return `${prefix} ${value}`;
}

class SelectQueryBuilder {
	slots = {
		select: new SelectSlotBuilder(),
		from: new SelectSlotBuilder(),
		where: new SelectSlotBuilder(),
		join: new SelectSlotBuilder(),
		order: new SelectSlotBuilder(),
		group: new SelectSlotBuilder(),
		limit: new SelectSlotBuilder(),
		offset: new SelectSlotBuilder(),
	}

	select(value: string) {
		this.slots.select.update(value);
		return this;
	}

	toString() {
		return Object.values(this.slots)
			.map((slot) => slot.toString())
			.filter(Boolean)
			.join(" ");
	}
}

class SelectSlotBuilder {
	value: string[];

	constructor(...value: string[]) {
		this.value = value;
	}

	update(value: string) {
		this.value.push(value);
	}

	toString() {
		return `select ${this.value.map(Boolean).join(" ")}`;
	}
}