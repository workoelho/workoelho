import type { ServerResponse } from "node:http";

import type { ReactElement } from "react";
import { renderToStaticNodeStream } from "react-dom/server";

/**
 * Render Component to HTML.
 */
export function render(response: ServerResponse, root: ReactElement) {
	response.statusCode ??= 200;
	response.setHeader("Content-Type", "text/html; charset=utf-8");
	const stream = renderToStaticNodeStream(root);
	stream.pipe(response);
}
