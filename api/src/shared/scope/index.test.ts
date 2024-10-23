import { describe, expect, mock, test } from "bun:test";

import { scope } from ".";

describe("scope", () => {
  test("option has actual value", () => {
    const fn = mock(() => void 0);
    scope({ key: "value" }, "key", fn);
    expect(fn).toHaveBeenCalledWith("value");
  });

  test("option is missing", () => {
    const fn = mock(() => void 0);
    scope({} as { key?: string }, "key", fn);
    expect(fn).not.toHaveBeenCalled();
  });

  test("option is undefined", () => {
    const fn = mock(() => void 0);
    scope({ key: undefined } as { key?: string }, "key", fn);
    expect(fn).toHaveBeenCalledWith(undefined);
  });
});
