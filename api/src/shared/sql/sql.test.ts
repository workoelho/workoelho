import { describe, expect, test } from "bun:test";

import {
  Criteria,
  Entry,
  Group,
  In,
  Join,
  Limit,
  Offset,
  Order,
  Patch,
  Query,
  Returning,
  Selection,
  Source,
} from "./sql";

describe("Patch", () => {
  const patch = new Patch({ a: 1 });

  test("constructor/set", () => {
    expect(patch.data).toEqual({ a: 1 });
  });

  test("merge", () => {
    const mergeable = new Patch({ b: 2 });
    patch.merge(mergeable);

    expect(patch.data).toEqual({ a: 1, b: 2 });

    // Test references are distinct.
    mergeable.set({ c: 3 });
    expect(patch.data).toEqual({ a: 1, b: 2 });
  });

  test("push", () => {
    patch.push({ c: ["? + ?", 3, 4] });
    patch.push({ d: undefined });
    expect(patch.data).toEqual({
      a: 1,
      b: 2,
      c: ["? + ?", 3, 4],
      d: undefined,
    });
  });

  test("toString", () => {
    expect(patch.toString()).toEqual("SET a = ?, b = ?, c = ? + ?");
  });

  test("bindings", () => {
    expect(patch.bindings).toEqual([1, 2, 3, 4]);
  });
});

describe("Entry", () => {
  const entry = new Entry({ a: 1 });

  test("constructor/set", () => {
    expect(entry.data).toEqual({ a: 1 });
  });

  test("merge", () => {
    const mergeable = new Entry();
    mergeable.set({ b: 2 });

    entry.merge(mergeable);

    expect(entry.data).toEqual({ a: 1, b: 2 });

    mergeable.set({ c: 3 });

    // Make sure references are independent.
    expect(entry.data).toEqual({ a: 1, b: 2 });
  });

  test("push", () => {
    entry.push({ c: ["? + ?", 3, 4] });
    entry.push({ d: undefined });
    expect(entry.data).toEqual({
      a: 1,
      b: 2,
      c: ["? + ?", 3, 4],
      d: undefined,
    });
  });

  test("toString", () => {
    expect(entry.toString()).toEqual("(a, b, c) VALUES (?, ?, ? + ?)");
  });

  test("bindings", () => {
    expect(entry.bindings).toEqual([1, 2, 3, 4]);
  });
});

describe("Selection", () => {
  const selection = new Selection("a", "b");

  test("constructor/set", () => {
    expect(selection.values).toEqual(["a", "b"]);
  });

  test("push", () => {
    selection.push("c", "d");
    expect(selection.values).toEqual(["a", "b", "c", "d"]);
  });

  test("merge", () => {
    selection.merge(new Selection("e", "f"));
    expect(selection.values).toEqual(["a", "b", "c", "d", "e", "f"]);
  });

  test("toString", () => {
    expect(selection.toString()).toEqual("a, b, c, d, e, f");
  });
});

describe("Returning", () => {
  const returning = new Returning("a", "b");

  test("constructor/set", () => {
    expect(returning.values).toEqual(["a", "b"]);
  });

  test("push", () => {
    returning.push("c", "d");
    expect(returning.values).toEqual(["a", "b", "c", "d"]);
  });

  test("merge", () => {
    returning.merge(new Returning("e", "f"));
    expect(returning.values).toEqual(["a", "b", "c", "d", "e", "f"]);
  });

  test("toString", () => {
    expect(returning.toString()).toEqual("RETURNING a, b, c, d, e, f");
  });
});

describe("Source", () => {
  const source = new Source("a", "b");

  test("constructor/set", () => {
    expect(source.values).toEqual(["a", "b"]);
  });

  test("push", () => {
    source.push("c", "d");
    expect(source.values).toEqual(["a", "b", "c", "d"]);
  });

  test("merge", () => {
    source.merge(new Source("e", "f"));
    expect(source.values).toEqual(["a", "b", "c", "d", "e", "f"]);
  });

  test("toString", () => {
    expect(source.toString()).toEqual("FROM a, b, c, d, e, f");
  });
});

describe("Join", () => {
  const join = new Join("t ON a = b");

  test("constructor/set", () => {
    expect(join.clauses).toEqual(["t ON a = b"]);
  });

  test("push", () => {
    join.push("t ON c = d");
    expect(join.clauses).toEqual(["t ON a = b", "t ON c = d"]);
  });

  test("merge", () => {
    join.merge(new Join("t ON e = f"));
    expect(join.clauses).toEqual(["t ON a = b", "t ON c = d", "t ON e = f"]);
  });

  test("toString", () => {
    expect(join.toString()).toEqual(
      "JOIN t ON a = b JOIN t ON c = d JOIN t ON e = f",
    );

    expect(new Join("JOIN t ON a = b").toString()).toEqual("JOIN t ON a = b");

    expect(new Join("INNER JOIN t ON a = b").toString()).toEqual(
      "INNER JOIN t ON a = b",
    );

    expect(new Join("LEFT JOIN t ON a = b").toString()).toEqual(
      "LEFT JOIN t ON a = b",
    );

    expect(new Join("LEFT OUTER JOIN t ON a = b").toString()).toEqual(
      "LEFT OUTER JOIN t ON a = b",
    );

    expect(new Join("RIGHT JOIN t ON a = b").toString()).toEqual(
      "RIGHT JOIN t ON a = b",
    );

    expect(new Join("RIGHT OUTER JOIN t ON a = b").toString()).toEqual(
      "RIGHT OUTER JOIN t ON a = b",
    );

    expect(new Join("FULL JOIN t ON a = b").toString()).toEqual(
      "FULL JOIN t ON a = b",
    );

    expect(new Join("FULL OUTER JOIN t ON a = b").toString()).toEqual(
      "FULL OUTER JOIN t ON a = b",
    );
  });
});

describe("Criteria", () => {
  const criteria = new Criteria(["a = ?", 1]);

  test("constructor/set", () => {
    expect(criteria.clauses).toEqual([["a = ?", 1]]);
  });

  test("push", () => {
    criteria.push("b = ?", 2);

    expect(criteria.clauses).toEqual([
      ["a = ?", 1],
      ["b = ?", 2],
    ]);
  });

  test("merge", () => {
    criteria.merge(new Criteria(["c = ?", 3]));

    expect(criteria.clauses).toEqual([
      ["a = ?", 1],
      ["b = ?", 2],
      ["c = ?", 3],
    ]);
  });

  test("toString", () => {
    expect(criteria.toString()).toEqual("WHERE a = ? AND b = ? AND c = ?");
  });

  test("bindings", () => {
    expect(criteria.bindings).toEqual([1, 2, 3]);
  });
});

describe("Order", () => {
  const order = new Order("a ASC", "b DESC");

  test("constructor/set", () => {
    expect(order.terms).toEqual(["a ASC", "b DESC"]);
  });

  test("push", () => {
    order.push("c ASC", "d DESC");
    expect(order.terms).toEqual(["a ASC", "b DESC", "c ASC", "d DESC"]);
  });

  test("merge", () => {
    order.merge(new Order("e ASC", "f DESC"));
    expect(order.terms).toEqual([
      "a ASC",
      "b DESC",
      "c ASC",
      "d DESC",
      "e ASC",
      "f DESC",
    ]);
  });

  test("toString", () => {
    expect(order.toString()).toEqual(
      "ORDER BY a ASC, b DESC, c ASC, d DESC, e ASC, f DESC",
    );
  });
});

describe("Group", () => {
  const group = new Group("a", "b");

  test("constructor/set", () => {
    expect(group.terms).toEqual(["a", "b"]);
  });

  test("push", () => {
    group.push("c", "d");
    expect(group.terms).toEqual(["a", "b", "c", "d"]);
  });

  test("merge", () => {
    group.merge(new Group("e", "f"));
    expect(group.terms).toEqual(["a", "b", "c", "d", "e", "f"]);
  });

  test("toString", () => {
    expect(group.toString()).toEqual("GROUP BY a, b, c, d, e, f");
  });
});

describe("Limit", () => {
  const limit = new Limit(1);

  test("constructor/set", () => {
    expect(limit.value).toEqual(1);
  });

  test("merge", () => {
    limit.merge(new Limit(2));
    expect(limit.value).toEqual(2);
  });

  test("toString", () => {
    expect(limit.toString()).toEqual("LIMIT 2");
  });
});

describe("Offset", () => {
  const offset = new Offset(1);

  test("constructor/set", () => {
    expect(offset.value).toEqual(1);
  });

  test("merge", () => {
    offset.merge(new Offset(2));
    expect(offset.value).toEqual(2);
  });

  test("toString", () => {
    expect(offset.toString()).toEqual("OFFSET 2");
  });
});

describe("Query", () => {
  const selection = new Selection("*");
  const source = new Source("t");
  const criteria = new Criteria(["f = ?", 1]);

  const query = new Query("SELECT", selection, source, criteria);

  test("constructor/set", () => {
    expect(query.fragments).toEqual(["SELECT", selection, source, criteria]);
  });

  test("push", () => {
    const limit = new Limit(1);
    const offset = ["OFFSET", 1] as [string, number];

    query.push(limit);

    expect(query.fragments).toEqual([
      "SELECT",
      selection,
      source,
      criteria,
      limit,
      offset,
    ]);
  });

  test("toSQL/toString/bindings", () => {
    expect(query.toSQL()).toEqual([
      "SELECT * FROM t WHERE f = ? LIMIT ? OFFSET ?",
      1,
      1,
      1,
    ]);
  });
});

describe("In", () => {
  const expr = new In("f", [1, 2, 3]);

  test("constructor", () => {
    expect(expr.column).toEqual("f");
    expect(expr.dataset).toEqual([1, 2, 3]);
  });

  test("toString", () => {
    expect(expr.toString()).toEqual("f IN (?, ?, ?)");
  });

  test("bindings", () => {
    expect(expr.bindings).toEqual([1, 2, 3]);
  });

  test("subquery", () => {
    const expr = new In("f", new Query(["SELECT f FROM t WHERE f = ?", 1]));
    expect(expr.toString()).toEqual("f IN (SELECT f FROM t WHERE f = ?)");
    expect(expr.bindings).toEqual([1]);
  });

  test("empty set", () => {
    expect(new In("f", []).toString()).toEqual("");
  });
});
