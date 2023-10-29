import { StringValidation, ZodIssue } from "zod";

type FormatErrorDetail = {
  format?: string;
  endsWith?: string;
  startsWith?: string;
};

type LengthErrorDetail = {
  minimum?: number;
  maximum?: number;
};

function createFormatErrorDetail(validation: StringValidation) {
  if (typeof validation === "string") {
    return { format: validation } as FormatErrorDetail;
  }
  return validation as FormatErrorDetail;
}

export class ValidationError<T = never> extends Error {
  path: (string | number)[];
  issue: string;
  detail?: T;

  constructor(path: (string | number)[], issue: string, detail?: T) {
    super("ValidationError");

    this.path = path;
    this.issue = issue;
    this.detail = detail;
  }

  static fromZodIssue<T extends ZodIssue>(issue: T) {
    switch (issue.code) {
      case "invalid_string":
        return new ValidationError<FormatErrorDetail>(
          issue.path,
          "format",
          createFormatErrorDetail(issue.validation)
        );
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
      case "too_small":
      case "too_big":
        return new ValidationError<LengthErrorDetail>(issue.path, "length");
      case "invalid_intersection_types":
      case "not_multiple_of":
      case "not_finite":
        return new ValidationError(issue.path, issue.code);
    }
  }
}
