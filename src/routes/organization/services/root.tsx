import * as superstruct from "superstruct";

import { HttpError } from "~/src/shared/error";
import { getBody } from "~/src/shared/request";
import { render } from "~/src/shared/response";
import { Layout } from "~/src/routes/organization/layout";
import {
  Service,
  Organization,
  Session,
  User,
  database,
} from "~/src/shared/database";
import { Context } from "~/src/shared/handler";
import { getSession } from "~/src/shared/session";
import { Id, validate } from "~/src/shared/validation";

export const url = "/organizations/:organizationId(\\d+)/services";

async function handleGet(context: Context) {
  const session = await getSession(context.request);

  if (!session) {
    throw new HttpError(401);
  }

  const services = await database.service.findMany({
    where: { organizationId: session.user.organizationId },
  });

  render(context.response, <Page services={services} session={session} />);
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
    applicationId: Id,
    providerId: Id,
  });

  const service = await database.service.create({
    data: {
      ...data,
      organizationId: session.user.organizationId,
    },
    select: { id: true },
  });

  context.response.writeHead(302, {
    Location: `/organizations/${session.user.organizationId}/services/${service.id}`,
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
  services: Service[];
};

function Page({ session, services }: Props) {
  return (
    <Layout title="Services" session={session}>
      <h1>All services</h1>

      <aside>
        <nav>
          <ul>
            <li>
              <a
                href={`/organizations/${session.user.organizationId}/services/new`}
              >
                Create new service
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {services.length === 0 ? (
        <p>No services found.</p>
      ) : (
        <ol>
          {services.map(({ id, name }) => (
            <li key={id}>
              <a
                href={`/organizations/${session.user.organizationId}/services/${id}`}
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
