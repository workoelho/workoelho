export class ValidationError extends Error {
  constructor(message: string) {
    super("Validation error: " + message);
  }

  toJSON() {
    return {
      message: this.message,
    };
  }
}
