import * as superstruct from "superstruct";

import { HttpError } from "~/src/shared/error";
import { render } from "~/src/shared/response";
import { Id, validate } from "~/src/shared/validation";
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
import { getBody } from "~/src/shared/request";

export const url =
  "/organizations/:organizationId(\\d+)/applications/:applicationId(\\d+)";

async function handleGet(context: Context) {
  const session = await getSession(context.request);

  if (!session) {
    throw new HttpError(401);
  }

  const { organizationId, applicationId } = validate(
    context.url.pathname.groups,
    {
      organizationId: Id,
      applicationId: Id,
    }
  );

  if (organizationId !== session.user.organizationId) {
    throw new HttpError(401);
  }

  if (applicationId === null) {
    throw new HttpError(400);
  }

  const application = await database.application.findUnique({
    where: { organizationId: session.user.organizationId, id: applicationId },
  });

  if (!application) {
    throw new HttpError(404);
  }

  render(
    context.response,
    <Page session={session} application={application} />
  );
}

async function handlePatch(context: Context) {
  const session = await getSession(context.request);

  if (!session) {
    throw new HttpError(401);
  }

  const { organizationId, applicationId } = validate(
    context.url.pathname.groups,
    {
      organizationId: Id,
      applicationId: Id,
    }
  );

  if (organizationId !== session.user.organizationId) {
    throw new HttpError(401);
  }

  if (applicationId === null) {
    throw new HttpError(400);
  }

  const data = await getBody(context.request, {
    url: superstruct.string(),
    name: superstruct.string(),
  });

  const application = await database.application.update({
    where: { id: applicationId, organizationId },
    data,
    select: { id: true },
  });

  context.response.setHeader(
    "Location",
    `/organizations/${organizationId}/applications/${application.id}`
  );
  context.response.writeHead(302);
  context.response.end();
}

async function handleDelete(context: Context) {
  const session = await getSession(context.request);

  if (!session) {
    throw new HttpError(401);
  }

  const { organizationId, applicationId } = validate(
    context.url.pathname.groups,
    {
      organizationId: Id,
      applicationId: Id,
    }
  );

  if (organizationId !== session.user.organizationId) {
    throw new HttpError(401);
  }

  if (applicationId === null) {
    throw new HttpError(400);
  }

  await database.application.delete({
    where: { id: applicationId, organizationId },
  });

  context.response.setHeader(
    "Location",
    `/organizations/${organizationId}/applications`
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
  application: Application;
};

function Page({ session, application }: Props) {
  return (
    <Layout title={application.name} session={session}>
      <h1>{application.name}</h1>

      <aside>
        <ul>
          <li>
            <a
              href={`/organizations/${session.user.organizationId}/applications/${application.id}/edit`}
            >
              Edit
            </a>
          </li>
          <li>
            <form
              method="POST"
              action={`/organizations/${session.user.organizationId}/applications/${application.id}?method=DELETE`}
            >
              <button>Delete</button>
            </form>
          </li>
        </ul>
      </aside>

      <dl>
        <dt>ID</dt>
        <dd>{application.id}</dd>
        <dt>Created at</dt>
        <dd>{application.createdAt.toLocaleString()}</dd>
        <dt>Updated at</dt>
        <dd>{application.updatedAt.toLocaleString()}</dd>
        <dt>Name</dt>
        <dd>{application.name}</dd>
        <dt>URL</dt>
        <dd>
          <a href={application.url} target="_blank" rel="noreferrer">
            {application.url}
          </a>
        </dd>
      </dl>
    </Layout>
  );
}
