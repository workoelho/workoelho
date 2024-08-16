function serialize(segment: unknown): string {
	switch (typeof segment) {
		case "string":
			return segment;
		case "number":
			return segment.toString();
		default:
			throw new Error(`Unsupported URL segment: ${JSON.stringify(segment)}`);
	}
}

/**
 * Build an URL from given segments.
 */
export function getUrl(...segments: unknown[]): string {
	return new URL(segments.map(serialize).join("/"), "http://placeholder")
		.pathname;
}
