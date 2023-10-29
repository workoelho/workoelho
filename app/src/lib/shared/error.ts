export class UserNotFoundError extends Error {
  constructor() {
    super("User not found");
  }
}

export class WrongPasswordError extends Error {
  constructor() {
    super("Wrong password");
  }
}

export type FormError = { field: string; issue: string };
