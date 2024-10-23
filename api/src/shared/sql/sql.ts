import type { Binding } from "~/src/shared/database";

/**
 * An SQL literal.
 */
export type Literal = string;

/**
 * An SQL expression.
 */
export type Expression = [Literal, ...Binding[]];

/**
 * An object that can compose an SQL expression.
 */
export type Composer = {
  bindings: Binding[];
  toString(): Literal;
};

/**
 * An SQL query fragment.
 */
export type Fragment = Literal | Expression | Composer;

/**
 * ...
 */
export type Data = Record<string, undefined | Binding | Expression>;

/**
 * Test if a value is an SQL expression.
 */
function isExpr(value: unknown): value is Expression {
  return Array.isArray(value) && typeof value[0] === "string";
}

/**
 * Test if a value is an object that can be represented to an SQL expression.
 */
function isComposer(value: unknown): value is Composer {
  return (
    typeof value === "object" &&
    value !== null &&
    "toString" in value &&
    "bindings" in value
  );
}

/**
 * SQL query builder.
 */
export class Query {
  fragments: Fragment[] = [];

  constructor(...fragments: Fragment[]) {
    this.set(...fragments);
  }

  get bindings() {
    return this.fragments.flatMap((fragment) => {
      if (isExpr(fragment)) {
        return fragment.slice(1);
      }

      if (isComposer(fragment)) {
        return fragment.bindings;
      }

      return [];
    });
  }

  merge(query: Query) {
    this.fragments.push(...query.fragments);
  }

  set(...fragments: Fragment[]) {
    this.fragments = [...fragments];
  }

  push(...fragments: Fragment[]) {
    this.fragments.push(...fragments);
  }

  toString() {
    return `${this.fragments
      .map((fragment) => (isExpr(fragment) ? fragment[0] : String(fragment)))
      .filter(Boolean)
      .join(" ")}`;
  }

  toSQL() {
    return [this.toString(), ...this.bindings] as Expression;
  }
}

/**
 * WHERE fragment of a SELECT/UPDATE query.
 */
export class Criteria {
  clauses: Fragment[] = [];

  constructor(...clauses: Fragment[]) {
    this.set(...clauses);
  }

  get bindings() {
    return this.clauses.flatMap((fragment) => {
      if (isExpr(fragment)) {
        return fragment.slice(1);
      }

      if (isComposer(fragment)) {
        return fragment.bindings;
      }

      return [];
    });
  }

  merge(criteria: Criteria) {
    this.clauses.push(...criteria.clauses);
  }

  set(...clauses: Fragment[]) {
    this.clauses = clauses;
  }

  push(...expr: Expression) {
    this.clauses.push(expr);
  }

  toString() {
    if (this.clauses.length === 0) {
      return "";
    }

    return `WHERE ${this.clauses
      .map((fragment) => {
        if (isExpr(fragment)) {
          return fragment[0];
        }
        return String(fragment);
      })
      .filter(Boolean)
      .join(" AND ")}`;
  }
}

/**
 * SET fragment of an UPDATE query.
 */
export class Patch {
  data: Data = {};

  constructor(data?: Data) {
    if (data) {
      this.set(data);
    }
  }

  get bindings() {
    return Object.values(this.data).flatMap((value) =>
      value === undefined ? [] : isExpr(value) ? value.slice(1) : value,
    );
  }

  merge(patch: Patch) {
    this.data = { ...this.data, ...patch.data };
  }

  set(data: Data) {
    this.data = { ...data };
  }

  push(data: Data) {
    this.data = { ...this.data, ...data };
  }

  toString() {
    const entries = Object.entries(this.data).filter(
      ([, value]) => value !== undefined,
    );

    if (entries.length === 0) {
      return "";
    }

    return `SET ${entries
      .map(([key, value]) =>
        isExpr(value) ? `${key} = ${value[0]}` : `${key} = ?`,
      )
      .filter(Boolean)
      .join(", ")}`;
  }
}

/**
 * VALUES fragment of an INSERT query.
 */
export class Entry {
  data: Data = {};

  constructor(data?: Data) {
    if (data) {
      this.set(data);
    }
  }

  get bindings() {
    return Object.values(this.data).flatMap((value) =>
      value === undefined ? [] : isExpr(value) ? value.slice(1) : value,
    );
  }

  merge(entry: Entry) {
    this.data = { ...this.data, ...entry.data };
  }

  set(data: Data) {
    this.data = { ...data };
  }

  push(data: Data) {
    this.data = { ...this.data, ...data };
  }

  toString() {
    const entries = Object.entries(this.data).filter(
      ([, value]) => value !== undefined,
    );

    if (entries.length === 0) {
      return "";
    }

    return `(${entries.map(([key]) => key).join(", ")}) VALUES (${entries
      .map(([, value]) => (isExpr(value) ? value[0] : "?"))
      .join(", ")})`;
  }
}

/**
 * RETURNING fragment of an INSERT/UPDATE query.
 */
export class Returning {
  values: string[] = [];

  constructor(...values: string[]) {
    this.set(...values);
  }

  get bindings() {
    return [];
  }

  merge(selection: Returning) {
    this.values.push(...selection.values);
  }

  set(...values: string[]) {
    this.values = [...values];
  }

  push(...values: string[]) {
    this.values.push(...values);
  }

  toString() {
    if (this.values.length === 0) {
      return "";
    }
    return `RETURNING ${this.values.join(", ")}`;
  }
}

/**
 * SELECT fragment of a SELECT query.
 */
export class Selection {
  values: string[] = [];

  constructor(...values: string[]) {
    this.set(...values);
  }

  get bindings() {
    return [];
  }

  merge(selection: Selection) {
    this.values.push(...selection.values);
  }

  set(...values: string[]) {
    this.values = [...values];
  }

  push(...values: string[]) {
    this.values.push(...values);
  }

  toString() {
    if (this.values.length === 0) {
      return "";
    }
    return this.values.join(", ");
  }
}

/**
 * FROM fragment of a SELECT query.
 */
export class Source {
  values: string[] = [];

  constructor(...values: string[]) {
    this.set(...values);
  }

  get bindings() {
    return [];
  }

  merge(source: Source) {
    this.values.push(...source.values);
  }

  set(...values: string[]) {
    this.values = [...values];
  }

  push(...values: string[]) {
    this.values.push(...values);
  }

  toString() {
    if (this.values.length === 0) {
      return "";
    }
    return `FROM ${this.values.join(", ")}`;
  }
}

/**
 * JOIN fragment of a SELECT query.
 */
export class Join {
  clauses: string[] = [];

  constructor(...clauses: string[]) {
    this.set(...clauses);
  }

  get bindings() {
    return [];
  }

  merge(join: Join) {
    this.clauses.push(...join.clauses);
  }

  set(...clauses: string[]) {
    this.clauses = [...clauses];
  }

  push(...clauses: string[]) {
    this.clauses.push(...clauses);
  }

  toString() {
    if (this.clauses.length === 0) {
      return "";
    }

    return this.clauses
      .map((value) => {
        if (/^((INNER|((LEFT|RIGHT|FULL)( OUTER)?)) )?JOIN\b/i.exec(value)) {
          return value;
        }
        return `JOIN ${value}`;
      })
      .join(" ");
  }
}

/**
 * GROUP BY fragment of a SELECT query.
 */
export class Group {
  terms: string[] = [];

  constructor(...terms: string[]) {
    this.set(...terms);
  }

  merge(group: Group) {
    this.terms.push(...group.terms);
  }

  set(...terms: string[]) {
    this.terms = [...terms];
  }

  push(...terms: string[]) {
    this.terms.push(...terms);
  }

  toString() {
    if (this.terms.length === 0) {
      return "";
    }
    return `GROUP BY ${this.terms.join(", ")}`;
  }
}

/**
 * ORDER BY fragment of a SELECT query.
 */
export class Order {
  terms: string[] = [];

  constructor(...terms: string[]) {
    this.set(...terms);
  }

  merge(group: Group) {
    this.terms.push(...group.terms);
  }

  set(...terms: string[]) {
    this.terms = [...terms];
  }

  push(...terms: string[]) {
    this.terms.push(...terms);
  }

  toString() {
    if (this.terms.length === 0) {
      return "";
    }
    return `ORDER BY ${this.terms.join(", ")}`;
  }
}

/**
 * LIMIT fragment of a SELECT/UPDATE query.
 */
export class Limit {
  value?: number;

  constructor(value?: number) {
    if (value !== undefined) {
      this.set(value);
    }
  }

  get bindings() {
    return this.value === undefined ? [] : [this.value];
  }

  merge(limit: Limit) {
    this.value = limit.value;
  }

  set(value: number) {
    this.value = value;
  }

  toString() {
    if (this.value === undefined) {
      return "";
    }
    return "LIMIT ?";
  }
}

/**
 * OFFSET fragment of a SELECT query.
 */
export class Offset {
  value?: number;

  constructor(value?: number) {
    if (value !== undefined) {
      this.set(value);
    }
  }

  get bindings() {
    return this.value === undefined ? [] : [this.value];
  }

  merge(limit: Offset) {
    this.value = limit.value;
  }

  set(value: number) {
    this.value = value;
  }

  toString() {
    if (this.value === undefined) {
      return "";
    }
    return "OFFSET ?";
  }
}

/**
 * A combination of LIMIT and OFFSET fragments.
 */
export class Pagination {
  length: number;
  page: number;

  constructor(length: number, page = 1) {
    this.length = length;
    this.page = page;
  }

  get bindings() {
    return [this.length, this.page * this.length - this.length];
  }

  merge(limit: Pagination) {
    this.length = limit.length;
    this.page = limit.page;
  }

  set(page: number) {
    this.page = page;
  }

  toString() {
    return "LIMIT ? OFFSET ?";
  }
}

/**
 * IN operator.
 */
export class In {
  column: string;
  dataset: Binding[] | Composer;

  constructor(column: string, dataset: Binding[] | Composer) {
    this.column = column;
    this.dataset = dataset;
  }

  get bindings() {
    return isComposer(this.dataset) ? this.dataset.bindings : this.dataset;
  }

  toString() {
    const dataset = isComposer(this.dataset)
      ? this.dataset.toString()
      : this.dataset.map(() => "?").join(", ");

    return `${this.column} IN (${dataset})`;
  }
}
