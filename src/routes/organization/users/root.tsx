import * as superstruct from "superstruct";

import { HttpError } from "~/src/shared/error";
import { getBody } from "~/src/shared/request";
import { render } from "~/src/shared/response";
import { Layout } from "~/src/routes/organization/layout";
import { User, Organization, Session, database } from "~/src/shared/database";
import { Context } from "~/src/shared/handler";
import { getSession } from "~/src/shared/session";
import { Id, validate } from "~/src/shared/validation";
import { createPassword } from "~/src/shared/password";

export const url = "/organizations/:organizationId(\\d+)/users";

async function handleGet(context: Context) {
  const session = await getSession(context.request);

  if (!session) {
    throw new HttpError(401);
  }

  const users = await database.user.findMany({
    where: { organizationId: session.user.organizationId },
  });

  render(context.response, <Page users={users} session={session} />);
}

async function handlePost(context: Context) {
  const session = await getSession(context.request);

  if (!session) {
    throw new HttpError(401);
  }

  const { organizationId } = validate(context.url.pathname.groups, {
    organizationId: Id,
  });

  if (organizationId !== session.user.organizationId) {
    throw new HttpError(401);
  }

  const data = await getBody(context.request, {
    name: superstruct.string(),
    email: superstruct.string(),
  });

  const user = await database.user.create({
    data: {
      ...data,
      password: await createPassword(Math.random().toString(36).slice(2)),
      organizationId: session.user.organizationId,
    },
    select: { id: true },
  });

  context.response.writeHead(302, {
    Location: `/organizations/${session.user.organizationId}/users/${user.id}`,
  });
  context.response.end();
}

export async function handler(context: Context) {
  switch (context.request.method) {
    case "GET":
      return handleGet(context);
    case "POST":
      return handlePost(context);
    default:
      throw new HttpError(405);
  }
}

type Props = {
  session: Session & { user: User & { organization: Organization } };
  users: User[];
};

function Page({ session, users }: Props) {
  return (
    <Layout title="Users" session={session}>
      <h1>All users</h1>

      <aside>
        <nav>
          <ul>
            <li>
              <a
                href={`/organizations/${session.user.organizationId}/users/new`}
              >
                Create new user
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ol>
          {users.map(({ id, name }) => (
            <li key={id}>
              <a
                href={`/organizations/${session.user.organizationId}/users/${id}`}
              >
                {name}
              </a>
            </li>
          ))}
        </ol>
      )}
    </Layout>
  );
}
