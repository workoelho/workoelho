import { useId } from "react";

import { render } from "~/src/shared/response";
import { HttpError } from "~/src/shared/error";
import { Layout } from "~/src/routes/organization/layout";
import { Context } from "~/src/shared/handler";
import { Id, validate } from "~/src/shared/validation";
import { getSession } from "~/src/shared/session";
import {
  Service,
  Organization,
  Session,
  User,
  database,
  Application,
  Provider,
} from "~/src/shared/database";

export const url =
  "/organizations/:organizationId(\\d+)/services/:serviceId(\\d+)/edit";

export async function handleGet(context: Context) {
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
  });

  const applications = await database.application.findMany({
    where: { organizationId: session.user.organizationId },
  });

  const providers = await database.provider.findMany({
    where: { organizationId: session.user.organizationId },
  });

  if (!service) {
    throw new HttpError(404);
  }

  render(
    context.response,
    <Page
      session={session}
      service={service}
      applications={applications}
      providers={providers}
    />
  );
}

export async function handler(context: Context) {
  switch (context.request.method) {
    case "GET":
      return handleGet(context);
    default:
      throw new HttpError(405);
  }
}

type Props = {
  session: Session & { user: User & { organization: Organization } };
  service: Service;
  applications: Application[];
  providers: Provider[];
};

function Page({ session, service, applications, providers }: Props) {
  const nameId = useId();
  const applicationIdId = useId();
  const providerIdId = useId();

  return (
    <Layout title="Edit service" session={session}>
      <h1>Edit service</h1>

      <form
        method="POST"
        action={`/organizations/${session.user.organizationId}/services/${service.id}?method=PATCH`}
      >
        <div>
          <label htmlFor={nameId}>Name:</label>
          <input
            id={nameId}
            type="text"
            name="name"
            value={service.name}
            required
            autoFocus
          />
        </div>

        <div>
          <label htmlFor={applicationIdId}>Application:</label>
          <select id={applicationIdId} name="applicationId" required>
            <option value="">Select an application…</option>
            {applications.map((application) => (
              <option
                key={application.id}
                value={application.id}
                selected={application.id === service.applicationId}
              >
                {application.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={providerIdId}>Provider:</label>
          <select id={providerIdId} name="providerId" required>
            <option value="">Select a provider…</option>
            {providers.map((provider) => (
              <option
                key={provider.id}
                value={provider.id}
                selected={provider.id === service.providerId}
              >
                {provider.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Save service</button>
      </form>
    </Layout>
  );
}
