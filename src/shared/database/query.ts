class Columns {
  content: string[] = [];

  constructor(...content: string[]) {
    this.content.push(...content);
  }

  toString() {
    if (this.content.length < 1) {
      return "";
    }
    return `SELECT ${this.content.join(", ")}`;
  }

  merge(columns: Columns) {
    this.content.push(...columns.content);
  }

  reset(...content: string[]) {
    this.content = [...content];
  }
}

class Sources {
  content: string[] = [];

  constructor(...content: string[]) {
    this.content.push(...content);
  }

  toString() {
    if (this.content.length < 1) {
      return "";
    }
    return `FROM ${this.content.join(", ")}`;
  }

  merge(sources: Sources) {
    this.content.push(...sources.content);
  }

  reset(...content: string[]) {
    this.content = [...content];
  }
}

class Criteria {
  clauses: [string, ...unknown[]][] = [];

  toString() {
    if (this.clauses.length < 1) {
      return "";
    }
    return `WHERE ${this.clauses.map((clause) => clause[0]).join(" AND ")}`;
  }

  get bindings() {
    return this.clauses.flatMap(([, ...bindings]) => bindings);
  }

  merge(criteria: Criteria) {
    this.clauses.push(...criteria.clauses);
  }

  reset(clause: string, ...bindings: unknown[]) {
    this.clauses = [[clause, ...bindings]];
  }
}

class GroupTerms {
  terms: string[] = [];

  constructor(...terms: string[]) {
    this.terms.push(...terms);
  }

  toString() {
    if (this.terms.length < 1) {
      return "";
    }
    return `GROUP BY ${this.terms.join(", ")}`;
  }

  merge(groupTerms: GroupTerms) {
    this.terms.push(...groupTerms.terms);
  }

  reset(...terms: string[]) {
    this.terms = [...terms];
  }
}

class OrderTerms {
  terms: string[] = [];

  constructor(...terms: string[]) {
    this.terms.push(...terms);
  }

  toString() {
    if (this.terms.length < 1) {
      return "";
    }
    return `ORDER BY ${this.terms.join(", ")}`;
  }

  merge(orderTerms: OrderTerms) {
    this.terms.push(...orderTerms.terms);
  }

  reset(...terms: string[]) {
    this.terms = [...terms];
  }
}

class Limit {
  value?: number;

  constructor(value?: number) {
    this.value = value;
  }

  toString() {
    if (this.value === undefined) {
      return "";
    }
    return `LIMIT ${this.value}`;
  }

  merge(limit: Limit) {
    this.value = limit.value ?? this.value;
  }

  reset(value?: number) {
    this.value = value;
  }
}

class Offset {
  value?: number;

  constructor(value?: number) {
    this.value = value;
  }

  toString() {
    if (this.value === undefined) {
      return "";
    }
    return `OFFSET ${this.value}`;
  }

  merge(offset: Offset) {
    this.value = offset.value ?? this.value;
  }

  reset(value?: number) {
    this.value = value;
  }
}

class SelectQuery {
  parts = {
    columns: new Columns(),
    sources: new Sources(),
    criteria: new Criteria(),
    limit: new Limit(),
    offset: new Offset(),
    groupTerms: new GroupTerms(),
    orderTerms: new OrderTerms(),
  } as const;

  get bindings() {
    return this.parts.criteria.bindings;
  }

  merge(query: SelectQuery) {
    this.parts.columns.merge(query.parts.columns);
    this.parts.sources.merge(query.parts.sources);
    this.parts.criteria.merge(query.parts.criteria);
    this.parts.groupTerms.merge(query.parts.groupTerms);
    this.parts.orderTerms.merge(query.parts.orderTerms);
    this.parts.limit.merge(query.parts.limit);
    this.parts.offset.merge(query.parts.offset);
  }

  select(...columns: string[]) {
    this.parts.columns.reset(...columns);
  }

  from(...values: string[]) {
    this.parts.sources.reset(...values);
  }

  where(clause: string, ...bindings: unknown[]) {
    this.parts.criteria.reset(clause, ...bindings);
  }

  groupBy(...terms: string[]) {
    this.parts.groupTerms.reset(...terms);
  }

  orderBy(...terms: string[]) {
    this.parts.orderTerms.reset(...terms);
  }

  limit(value: number) {
    this.parts.limit.reset(value);
  }

  offset(value: number) {
    this.parts.offset.reset(value);
  }

  toString() {
    const {
      columns,
      sources,
      criteria,
      groupTerms,
      orderTerms,
      limit,
      offset,
    } = this.parts;

    return `${[
      columns,
      sources,
      criteria,
      groupTerms,
      orderTerms,
      limit,
      offset,
    ]
      .map(String)
      .filter(Boolean)
      .join(" ")};`;
  }
}

export function select(...columns: string[]) {
  const query = new SelectQuery();
  query.select(...columns);
  return query;
}

export function from(...values: string[]) {
  const query = new SelectQuery();
  query.from(...values);
  return query;
}

export function where(clause: string, ...bindings: unknown[]) {
  const query = new SelectQuery();
  query.where(clause, ...bindings);
  return query;
}

export function limit(value: number) {
  const query = new SelectQuery();
  query.limit(value);
  return query;
}

export function offset(value: number) {
  const query = new SelectQuery();
  query.offset(value);
  return query;
}

export function groupBy(...terms: string[]) {
  const query = new SelectQuery();
  query.groupBy(...terms);
  return query;
}

export function orderBy(...terms: string[]) {
  const query = new SelectQuery();
  query.orderBy(...terms);
  return query;
}
