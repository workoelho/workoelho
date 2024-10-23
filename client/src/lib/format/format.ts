export function currency(
  value: number,
  options: Intl.NumberFormatOptions = {},
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    currencySign: "standard",
    minimumFractionDigits: 0,
    ...options,
  }).format(value);
}

export function datetime(
  value: Date | string,
  options: Intl.DateTimeFormatOptions = {},
) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "short",
    timeStyle: "short",
    ...options,
  }).format(new Date(value));
}

export function number(value: number, options: Intl.NumberFormatOptions = {}) {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    ...options,
  }).format(value);
}

export function capitalize(string: string) {
  return string.replace(/\b\w/g, (char) => char.toUpperCase());
}
