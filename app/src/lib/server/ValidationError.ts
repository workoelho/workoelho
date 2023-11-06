export class ValidationError extends Error {
  constructor(message: string) {
    super("Validation error: " + message);
  }
}
