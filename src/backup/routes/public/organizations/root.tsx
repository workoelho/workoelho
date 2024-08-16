import * as superstruct from "superstruct";
import { Organization, Session, User } from "~/src/database";

import { HttpError } from "~/src/shared/error";
import type { Context } from "~/src/shared/handler";
import { getBody } from "~/src/shared/request";
import { getSessionExpiration, setSessionCookie } from "~/src/shared/session";

export const constraint = "/organizations";

export async function handler(context: Context) {
	switch (context.request.method) {
		case "POST":
			return handleCreateOrganization(context);
		default:
			throw new HttpError(405);
	}
}

async function handleCreateOrganization(context: Context) {
	const data = await getBody(context.request, {
		organization: superstruct.string(),
		name: superstruct.string(),
		email: superstruct.string(),
		password: superstruct.string(),
	});

	const organization = await Organization.create({
		name: data.organization,
	});

	const user = await User.create({
		organizationId: organization.id,
		name: data.name,
		email: data.email,
		password: data.password,
	});

	const expiresAt = getSessionExpiration();

	const session = await Session.create({
		expiresAt,
		organizationId: organization.id,
		userId: user.id,
	});

	setSessionCookie(context.response, session.id, expiresAt);

	context.response.writeHead(302, {
		Location: `/organizations/${organization.id}/applications`,
	});
	context.response.end();
}
