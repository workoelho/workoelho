import * as superstruct from "superstruct";

import { HttpError } from "~/src/shared/error";
import { render } from "~/src/shared/response";
import { Id, validate } from "~/src/shared/validation";
import { Layout } from "~/src/routes/organization/layout";
import {
  Service,
  Organization,
  Session,
  User,
  database,
  Application,
  Provider,
} from "~/src/shared/database";
import { Context } from "~/src/shared/handler";
import { getSession } from "~/src/shared/session";
import { getBody } from "~/src/shared/request";
import { Button } from "~/src/components/Button";

export const url =
  "/organizations/:organizationId(\\d+)/services/:serviceId(\\d+)";

async function handleGet(context: Context) {
  const session = await getSession(context.request);

  if (!session) {
    throw new HttpError(401);
  }

  const { organizationId, serviceId } = validate(context.url.pathname.groups, {
    organizationId: Id,
    serviceId: Id,
  });

  if (organizationId !== session.user.organizationId) {
    throw new HttpError(401);
  }

  if (serviceId === null) {
    throw new HttpError(400);
  }

  const service = await database.service.findUnique({
    where: { organizationId: session.user.organizationId, id: serviceId },
    include: { application: true, provider: true },
  });

  if (!service) {
    throw new HttpError(404);
  }

  render(context.response, <Page session={session} service={service} />);
}

async function handlePatch(context: Context) {
  const session = await getSession(context.request);

  if (!session) {
    throw new HttpError(401);
  }

  const { organizationId, serviceId } = validate(context.url.pathname.groups, {
    organizationId: Id,
    serviceId: Id,
  });

  if (organizationId !== session.user.organizationId) {
    throw new HttpError(401);
  }

  if (serviceId === null) {
    throw new HttpError(400);
  }

  const data = await getBody(context.request, {
    name: superstruct.string(),
    applicationId: Id,
    providerId: Id,
  });

  const service = await database.service.update({
    where: { id: serviceId, organizationId },
    data,
    select: { id: true },
  });

  context.response.setHeader(
    "Location",
    `/organizations/${organizationId}/services/${service.id}`
  );
  context.response.writeHead(302);
  context.response.end();
}

async function handleDelete(context: Context) {
  const session = await getSession(context.request);

  if (!session) {
    throw new HttpError(401);
  }

  const { organizationId, serviceId } = validate(context.url.pathname.groups, {
    organizationId: Id,
    serviceId: Id,
  });

  if (organizationId !== session.user.organizationId) {
    throw new HttpError(401);
  }

  if (serviceId === null) {
    throw new HttpError(400);
  }

  await database.service.delete({
    where: { id: serviceId, organizationId },
  });

  context.response.setHeader(
    "Location",
    `/organizations/${organizationId}/services`
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
  service: Service & { application: Application; provider: Provider };
};

function Page({ session, service }: Props) {
  return (
    <Layout title={service.name} session={session}>
      <h1>{service.name}</h1>

      <aside>
        <ul>
          <li>
            <a
              href={`/organizations/${session.user.organizationId}/services/${service.id}/edit`}
            >
              Edit
            </a>
          </li>
          <li>
            <Button
              method="post"
              action={`/organizations/${session.user.organizationId}/services/${service.id}?method=delete`}
            >
              Delete
            </Button>
          </li>
        </ul>
      </aside>

      <dl>
        <dt>ID</dt>
        <dd>{service.id}</dd>
        <dt>Created at</dt>
        <dd>{service.createdAt.toLocaleString()}</dd>
        <dt>Updated at</dt>
        <dd>{service.updatedAt.toLocaleString()}</dd>
        <dt>Name</dt>
        <dd>{service.name}</dd>
        <dt>Application</dt>
        <dd>{service.application.name}</dd>
        <dt>Provider</dt>
        <dd>{service.provider.name}</dd>
      </dl>
    </Layout>
  );
}
