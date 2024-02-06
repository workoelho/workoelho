import * as superstruct from "superstruct";

import { HttpError } from "~/src/shared/error";
import { render, getBody } from "~/src/shared/response";
import { Layout } from "~/src/routes/organization/layout";
import {
  Application,
  Organization,
  Session,
  User,
  database,
} from "~/src/shared/database";
import { Context } from "~/src/shared/handler";
import { getSession } from "~/src/shared/session";
import { Id, validate } from "~/src/shared/validation";

export const url = "/organizations/:organizationId(\\d+)/applications";

async function handleGet(context: Context) {
  const session = await getSession(context.request);

  if (!session) {
    throw new HttpError(401);
  }

  const applications = await database.application.findMany({
    where: { organizationId: session.user.organizationId },
  });

  render(
    context.response,
    <Page applications={applications} session={session} />
  );
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
    url: superstruct.string(),
    name: superstruct.string(),
  });

  const application = await database.application.create({
    data: {
      ...data,
      organizationId: session.user.organizationId,
    },
    select: { id: true },
  });

  context.response.writeHead(302, {
    Location: `/organizations/${session.user.organizationId}/applications/${application.id}`,
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
  applications: Application[];
};

function Page({ session, applications }: Props) {
  return (
    <Layout title="Applications" organization={session.user.organization}>
      <h1>All applications</h1>

      <aside>
        <nav>
          <ul>
            <li>
              <a
                href={`/organizations/${session.user.organizationId}/applications/new`}
              >
                Create new application
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <ol>
          {applications.map(({ id, name }) => (
            <li key={id}>
              <a
                href={`/organizations/${session.user.organizationId}/applications/${id}`}
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
