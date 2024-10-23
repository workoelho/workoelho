/**
 * Log a message.
 */
export function print(level: "log" | "error", ...message: unknown[]) {
  console[level](new Date().toISOString(), ...message);
}
