import { useId } from "react";

import { render } from "~/src/shared/response";
import { HttpError } from "~/src/shared/error";
import { Layout } from "~/src/routes/organization/layout";
import { Context } from "~/src/shared/handler";
import { Id, validate } from "~/src/shared/validation";
import { getSession } from "~/src/shared/session";
import {
  Application,
  Organization,
  Session,
  User,
  Provider,
  database,
} from "~/src/shared/database";

export const url = "/organizations/:organizationId(\\d+)/services/new";

export async function handleGet(context: Context) {
  if (context.request.method !== "GET") {
    throw new HttpError(405);
  }

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

  const applications = await database.application.findMany({
    where: { organizationId: session.user.organizationId },
  });

  const providers = await database.provider.findMany({
    where: { organizationId: session.user.organizationId },
  });

  render(
    context.response,
    <Page session={session} applications={applications} providers={providers} />
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
  applications: Application[];
  providers: Provider[];
};

function Page({ session, applications, providers }: Props) {
  const nameId = useId();
  const applicationIdId = useId();
  const providerIdId = useId();

  return (
    <Layout title="New service" session={session}>
      <h1>Create new service</h1>

      <form
        method="POST"
        action={`/organizations/${session.user.organizationId}/services`}
      >
        <div>
          <label htmlFor={nameId}>Name:</label>
          <input id={nameId} type="text" name="name" required autoFocus />
        </div>

        <div>
          <label htmlFor={applicationIdId}>Application:</label>
          <select id={applicationIdId} name="applicationId" required>
            <option value="">Select an application…</option>
            {applications.map((application) => (
              <option key={application.id} value={application.id}>
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
              <option key={provider.id} value={provider.id}>
                {provider.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Create service</button>
      </form>
    </Layout>
  );
}
