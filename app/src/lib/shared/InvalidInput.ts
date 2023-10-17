import { ZodError } from "zod";

export type Issue = {
  path: (string | number)[];
  code: string;
};

function mapIssueCode(code: string) {
  return code.replace(/_(\w)/g, (_, initial) => initial.toUpperCase());
}

export class InvalidInput extends Error {
  issues: Issue[];

  constructor(issues: Issue[]) {
    super("InvalidInput");

    this.issues = issues;
  }

  static fromZodError(error: ZodError) {
    return new InvalidInput(
      error.issues.map((issue) => ({
        path: issue.path,
        code: mapIssueCode(issue.code),
      }))
    );
  }

  toJSON() {
    return this.issues;
  }
}

export function getIssueMessage(
  issue: Issue,
  messages?: Record<string, string>
) {
  if (issue.code === "custom" && !(messages && "custom" in messages)) {
    throw new Error("You must provide a custom message for custom issues");
  }

  const message = messages?.[issue.code];
  if (message) {
    return message;
  }

  switch (issue.code) {
    case "invalid_type":
    case "invalid_literal":
    case "custom":
    case "invalid_union":
    case "invalid_union_discriminator":
    case "invalid_enum_value":
    case "unrecognized_keys":
    case "invalid_arguments":
    case "invalid_return_type":
    case "invalid_date":
    case "invalid_string":
    case "too_small":
    case "too_big":
    case "invalid_intersection_types":
    case "not_multiple_of":
    case "not_finite":
      return issue.code;
  }
}
