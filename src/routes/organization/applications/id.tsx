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
  return (
    <Layout title={application.name} session={session}>
      <h1>{application.name}</h1>
      <p>{application.url}</p>
    </Layout>
  );
}
