import * as superstruct from "superstruct";

import { HttpError } from "~/src/shared/error";
import { render } from "~/src/shared/response";
import { Id, validate } from "~/src/shared/validation";
import { Layout } from "~/src/routes/organization/layout";
import { User, Organization, Session, database } from "~/src/shared/database";
import { Context } from "~/src/shared/handler";
import { getSession } from "~/src/shared/session";
import { getBody } from "~/src/shared/request";
import { Button } from "~/src/components/Button";

export const url = "/organizations/:organizationId(\\d+)/users/:userId(\\d+)";

async function handleGet(context: Context) {
  const session = await getSession(context.request);

  if (!session) {
    throw new HttpError(401);
  }

  const { organizationId, userId } = validate(context.url.pathname.groups, {
    organizationId: Id,
    userId: Id,
  });

  if (organizationId !== session.user.organizationId) {
    throw new HttpError(401);
  }

  if (userId === null) {
    throw new HttpError(400);
  }

  const user = await database.user.findUnique({
    where: { organizationId: session.user.organizationId, id: userId },
  });

  if (!user) {
    throw new HttpError(404);
  }

  render(context.response, <Page session={session} user={user} />);
}

async function handlePatch(context: Context) {
  const session = await getSession(context.request);

  if (!session) {
    throw new HttpError(401);
  }

  const { organizationId, userId } = validate(context.url.pathname.groups, {
    organizationId: Id,
    userId: Id,
  });

  if (organizationId !== session.user.organizationId) {
    throw new HttpError(401);
  }

  if (userId === null) {
    throw new HttpError(400);
  }

  const data = await getBody(context.request, {
    name: superstruct.string(),
    applicationId: Id,
    providerId: Id,
  });

  const user = await database.user.update({
    where: { id: userId, organizationId },
    data,
    select: { id: true },
  });

  context.response.setHeader(
    "Location",
    `/organizations/${organizationId}/users/${user.id}`
  );
  context.response.writeHead(302);
  context.response.end();
}

async function handleDelete(context: Context) {
  const session = await getSession(context.request);

  if (!session) {
    throw new HttpError(401);
  }

  const { organizationId, userId } = validate(context.url.pathname.groups, {
    organizationId: Id,
    userId: Id,
  });

  if (organizationId !== session.user.organizationId) {
    throw new HttpError(401);
  }

  if (userId === null) {
    throw new HttpError(400);
  }

  await database.user.delete({
    where: { id: userId, organizationId },
  });

  context.response.setHeader(
    "Location",
    `/organizations/${organizationId}/users`
  );
  context.response.writeHead(302);
  context.response.end();
}

export async function handler(context: Context) {
  switch (context.request.method) {
    case "GET":
      return handleGet(context);
    case "PATCH":
      return handlePatch(context);
    case "DELETE":
      return handleDelete(context);
    default:
      throw new HttpError(405);
  }
}

type Props = {
  session: Session & { user: User & { organization: Organization } };
  user: User;
};

function Page({ session, user }: Props) {
  return (
    <Layout title={user.name} session={session}>
      <h1>{user.name}</h1>

      <aside>
        <ul>
          <li>
            <a
              href={`/organizations/${session.user.organizationId}/users/${user.id}/edit`}
            >
              Edit
            </a>
          </li>
          <li>
            <Button
              method="post"
              action={`/organizations/${session.user.organizationId}/users/${user.id}?method=delete`}
            >
              Delete
            </Button>
          </li>
        </ul>
      </aside>

      <dl>
        <dt>ID</dt>
        <dd>{user.id}</dd>
        <dt>Created at</dt>
        <dd>{user.createdAt.toLocaleString()}</dd>
        <dt>Updated at</dt>
        <dd>{user.updatedAt.toLocaleString()}</dd>
        <dt>Name</dt>
        <dd>{user.name}</dd>
        <dt>E-mail</dt>
        <dd>{user.email}</dd>
        <dt>Role</dt>
        <dd>{user.role}</dd>
      </dl>
    </Layout>
  );
}
