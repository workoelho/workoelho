import type { IncomingMessage, ServerResponse } from "node:http";

import * as superstruct from "superstruct";
import * as db from "~/src/database";
import { HttpError } from "~/src/shared/error";
import { compare } from "~/src/shared/password";
import { getBody, getMethod } from "~/src/shared/request";
import {
	clearSessionCookie,
	getSessionExpiration,
	getSessionId,
	setSessionCookie,
} from "~/src/shared/session";

export async function handler(request: IncomingMessage, response: ServerResponse) {
	switch (getMethod(request)) {
		case "POST":
			return handleCreateSession(request, response);
		case "DELETE":
			return handleDeleteSession(request, response);
		default:
			throw new HttpError(405);
	}
}

async function handleCreateSession(request: IncomingMessage, response: ServerResponse) {
	const data = await getBody(request, {
		email: superstruct.string(),
		password: superstruct.string(),
	});

	const user = await db.user.get({
		where: "email = $email",
		parameters: { email: data.email },
	});

	if (!user) {
		throw new HttpError(401);
	}

	if (!(await compare(data.password, user.password))) {
		throw new HttpError(401);
	}

	const expiresAt = getSessionExpiration();

	const session = await db.session.create({
		data:{
		expiresAt,
		userId: user.id,
		organizationId: user.organizationId,}
	});

	setSessionCookie(response, session.id, expiresAt);

	response.writeHead(302, {
		Location: `/organizations/${session.organizationId}/applications`,
	});
	response.end();
}

async function handleDeleteSession(request: IncomingMessage, response: ServerResponse) {
	const sessionId = getSessionId(request);

	if (sessionId) {
		await db.session.update({
			data: {
				expiresAt: new Date(),
			},
			parameters: { id: sessionId },
		});
	}

	clearSessionCookie(response);

	response.writeHead(302, {
		Location: "/sessions/new",
	});
	response.end();
}
