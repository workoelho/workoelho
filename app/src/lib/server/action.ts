export type ActionContext = { data: Record<string, unknown> };

export type ActionResult<T extends (...args: any[]) => Promise<any>> = Awaited<
  ReturnType<T>
>;
