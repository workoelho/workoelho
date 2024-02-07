import * as superstruct from "superstruct";

import { HttpError } from "~/src/shared/error";
import { render } from "~/src/shared/response";
import { Id, validate } from "~/src/shared/validation";
import { Layout } from "~/src/routes/organization/layout";
import {
  Provider,
  Organization,
  Session,
  User,
  database,
} from "~/src/shared/database";
import { Context } from "~/src/shared/handler";
import { getSession } from "~/src/shared/session";
import { getBody } from "~/src/shared/request";

export const url =
  "/organizations/:organizationId(\\d+)/providers/:providerId(\\d+)";

async function handleGet(context: Context) {
  const session = await getSession(context.request);

  if (!session) {
    throw new HttpError(401);
  }

  const { organizationId, providerId } = validate(context.url.pathname.groups, {
    organizationId: Id,
    providerId: Id,
  });

  if (organizationId !== session.user.organizationId) {
    throw new HttpError(401);
  }

  if (providerId === null) {
    throw new HttpError(400);
  }

  const provider = await database.provider.findUnique({
    where: { organizationId: session.user.organizationId, id: providerId },
  });

  if (!provider) {
    throw new HttpError(404);
  }

  render(context.response, <Page session={session} provider={provider} />);
}

async function handlePatch(context: Context) {
  const session = await getSession(context.request);

  if (!session) {
    throw new HttpError(401);
  }

  const { organizationId, providerId } = validate(context.url.pathname.groups, {
    organizationId: Id,
    providerId: Id,
  });

  if (organizationId !== session.user.organizationId) {
    throw new HttpError(401);
  }

  if (providerId === null) {
    throw new HttpError(400);
  }

  const data = await getBody(context.request, {
    url: superstruct.string(),
    name: superstruct.string(),
  });

  const provider = await database.provider.update({
    where: { id: providerId, organizationId },
    data,
    select: { id: true },
  });

  context.response.setHeader(
    "Location",
    `/organizations/${organizationId}/providers/${provider.id}`
  );
  context.response.writeHead(302);
  context.response.end();
}

async function handleDelete(context: Context) {
  const session = await getSession(context.request);

  if (!session) {
    throw new HttpError(401);
  }

  const { organizationId, providerId } = validate(context.url.pathname.groups, {
    organizationId: Id,
    providerId: Id,
  });

  if (organizationId !== session.user.organizationId) {
    throw new HttpError(401);
  }

  if (providerId === null) {
    throw new HttpError(400);
  }

  await database.provider.delete({
    where: { id: providerId, organizationId },
  });

  context.response.setHeader(
    "Location",
    `/organizations/${organizationId}/providers`
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
  provider: Provider;
};

function Page({ session, provider }: Props) {
  return (
    <Layout title={provider.name} session={session}>
      <h1>{provider.name}</h1>

      <aside>
        <ul>
          <li>
            <a
              href={`/organizations/${session.user.organizationId}/providers/${provider.id}/edit`}
            >
              Edit
            </a>
          </li>
          <li>
            <form
              method="POST"
              action={`/organizations/${session.user.organizationId}/providers/${provider.id}?method=DELETE`}
            >
              <button>Delete</button>
            </form>
          </li>
        </ul>
      </aside>

      <dl>
        <dt>ID</dt>
        <dd>{provider.id}</dd>
        <dt>Created at</dt>
        <dd>{provider.createdAt.toLocaleString()}</dd>
        <dt>Updated at</dt>
        <dd>{provider.updatedAt.toLocaleString()}</dd>
        <dt>Name</dt>
        <dd>{provider.name}</dd>
        <dt>URL</dt>
        <dd>
          <a href={provider.url} target="_blank" rel="noreferrer">
            {provider.url}
          </a>
        </dd>
      </dl>
    </Layout>
  );
}
