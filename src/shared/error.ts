/**
 * Error with an HTTP status code.
 */
export class HttpError extends Error {
	public statusCode: number;

	constructor(statusCode: number, ...error: Parameters<typeof Error>) {
		super(...error);
		this.statusCode = statusCode;
	}

	/**
	 * Extract HTTP status code from an error object.
	 */
	static getStatusCode(error: unknown) {
		if (
			typeof error === "object" &&
			error !== null &&
			"statusCode" in error &&
			typeof error.statusCode === "number"
		) {
			return error.statusCode;
		}

		throw new Error("Not an HTTP error object.", { cause: error });
	}
}
