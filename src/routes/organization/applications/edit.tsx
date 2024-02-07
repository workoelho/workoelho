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
  database,
} from "~/src/shared/database";

export const url =
  "/organizations/:organizationId(\\d+)/applications/:applicationId(\\d+)/edit";

export async function handleGet(context: Context) {
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
  application: Application;
};

function Page({ session, application }: Props) {
  const nameId = useId();
  const urlId = useId();

  return (
    <Layout title="Edit application" session={session}>
      <h1>Edit application</h1>

      <form
        method="POST"
        action={`/organizations/${session.user.organizationId}/applications/${application.id}?method=PATCH`}
      >
        <div>
          <label htmlFor={nameId}>Name:</label>
          <input
            id={nameId}
            type="text"
            name="name"
            value={application.name}
            required
            autoFocus
          />
        </div>

        <div>
          <label htmlFor={urlId}>URL:</label>
          <input id={urlId} type="url" name="url" value={application.url} />
        </div>

        <button type="submit">Save application</button>
      </form>
    </Layout>
  );
}
