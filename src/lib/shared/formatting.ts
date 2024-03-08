type Formatable = number | Date;

type Options = Intl.NumberFormatOptions | Intl.DateTimeFormatOptions;

export function format(
  value: number,
  locale?: string,
  options?: Intl.NumberFormatOptions
): string;
export function format(
  value: Date,
  locale?: string,
  options?: Intl.DateTimeFormatOptions
): string;
export function format(value: Formatable, locale?: string, options?: Options) {
  if (typeof value === "number") {
    return new Intl.NumberFormat(
      locale,
      options as Intl.NumberFormatOptions
    ).format(value);
  }

  if (value instanceof Date) {
    return new Intl.DateTimeFormat(
      locale,
      options as Intl.DateTimeFormatOptions
    ).format(value);
  }

  throw new Error("Value is not formatable");
}
