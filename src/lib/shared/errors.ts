export class NotFoundError extends Error {
  constructor(message = "") {
    super("Not found: " + message);
  }
}

export class UnauthorizedError extends Error {
  constructor(message = "") {
    super("Unauthorized: " + message);
  }
}

export class ForbiddenError extends Error {
  constructor(message = "") {
    super("Forbidden: " + message);
  }
}
