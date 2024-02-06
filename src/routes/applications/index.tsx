import * as superstruct from "superstruct";

import { HttpError } from "~/src/shared/error";
import { render, getBody } from "~/src/shared/response";
import Layout from "~/src/routes/layout";
import { Application, database } from "~/src/shared/database";
import { Context } from "~/src/shared/handler";

export const url = "/applications";

async function handleGet(context: Context) {
  const applications = await database.application.findMany();
  render(context.response, <Page applications={applications} />);
}

async function handlePost(context: Context) {
  const data = await getBody(context.request, {
    url: superstruct.string(),
    name: superstruct.string(),
  });

  const application = await database.application.create({
    data: {
      ...data,
      organizationId: 1,
    },
    select: { id: true },
  });

  context.response.writeHead(302, {
    Location: `/applications/${application.id}`,
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
  applications: Application[];
};

function Page({ applications }: Props) {
  return (
    <Layout>
      <h1>All applications</h1>

      <aside>
        <a href="/applications/new">Create new application</a>
      </aside>

      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <ul>
          {applications.map(({ id, name }) => (
            <li key={id}>
              <a href={`/applications/${id}`}>{name}</a>
            </li>
          ))}
        </ul>
      )}
    </Layout>
  );
}
