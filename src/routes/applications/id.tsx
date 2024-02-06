import { HttpError } from "~/src/shared/error";
import { render } from "~/src/shared/response";
import { Id, validate } from "~/src/shared/validation";
import Layout from "~/src/routes/layout";
import { Application, database } from "~/src/shared/database";
import { Context } from "~/src/shared/handler";

export const url = "/applications/:id(\\d+)";

async function handleGet(context: Context) {
  const { id: applicationId } = validate(context.url.pathname.groups, {
    id: Id,
  });

  if (applicationId === null) {
    throw new HttpError(400);
  }

  const application = await database.application.findUnique({
    where: { id: applicationId },
  });

  if (!application) {
    throw new HttpError(404);
  }

  render(context.response, <Page application={application} />);
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
  application: Application;
};

function Page({ application }: Props) {
  return (
    <Layout title={application.name}>
      <h1>{application.name}</h1>
      <p>{application.url}</p>
    </Layout>
  );
}
