/**
 * Format numbers.
 */
export function formatNumber(
  value: number,
  { locale, ...options }: Intl.NumberFormatOptions & { locale?: string } = {},
) {
  return new Intl.NumberFormat(locale, options).format(value);
}

/**
 * Format dates and times.
 */
export function formatDateTime(
  value: Date,
  { locale, ...options }: Intl.DateTimeFormatOptions & { locale?: string } = {},
) {
  return new Intl.DateTimeFormat(locale, options).format(value);
}

/**
 * Format lists.
 */
export function formatList(
  values: string[],
  { locale, ...options }: Intl.ListFormatOptions & { locale?: string } = {},
) {
  return new Intl.ListFormat(locale, options).format(values);
}

type TextFormatOptions =
  | { shortName: boolean }
  | { titleCase: boolean }
  | { lowerCase: boolean }
  | { upperCase: boolean };

/**
 * Common text manipulations.
 */
export function formatText(value: string, options: TextFormatOptions) {
  if ("titleCase" in options && options.titleCase) {
    return value.replaceAll(/(\b\w)/g, (letter) => letter.toLocaleUpperCase());
  }
  if ("lowerCase" in options && options.lowerCase) {
    return value.toLocaleLowerCase();
  }
  if ("upperCase" in options && options.upperCase) {
    return value.toLocaleUpperCase();
  }
  if ("shortName" in options && options.shortName) {
    const parts = value.split(/\s/);
    if (parts.length === 1) {
      return value;
    }
    return `${parts[0]} ${parts[parts.length - 1][0]}.`;
  }
}
