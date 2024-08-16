/**
 * Log message to the console.
 */
export function print(level: "log" | "error", message: string, ...values: unknown[]): void {
	const now = new Date().toISOString();
	const dump = values.map((value => JSON.stringify(value))).join(" ");

	switch (level) {
		case "log":
			console.log(`${now} log ${message} ${dump}`);
			break;
		case "error":
			console.error(`${now} error ${message} ${dump}`);
			break;
		default:
			throw new Error(`Unknown log level ${JSON.stringify(level)}`);
	}
}
