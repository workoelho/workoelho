/**
 * Get a random number between min and max.
 */
export function number(min = 0, max = 1) {
  if (min === 0 && max === 1) {
    return Math.random();
  }
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Get a random string of a given length.
 */
export function string(
  length: number,
  charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
) {
  let string = "";
  for (let i = 0; i < length; i++) {
    string += charset.charAt(number(0, charset.length - 1));
  }
  return string;
}
