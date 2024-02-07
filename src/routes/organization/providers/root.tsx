import * as superstruct from "superstruct";

import { HttpError } from "~/src/shared/error";
import { getBody } from "~/src/shared/request";
import { render } from "~/src/shared/response";
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
import { Id, validate } from "~/src/shared/validation";

export const url = "/organizations/:organizationId(\\d+)/providers";

async function handleGet(context: Context) {
  const session = await getSession(context.request);

  if (!session) {
    throw new HttpError(401);
  }

  const providers = await database.provider.findMany({
    where: { organizationId: session.user.organizationId },
  });

  render(context.response, <Page providers={providers} session={session} />);
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
    url: superstruct.string(),
    name: superstruct.string(),
  });

  const provider = await database.provider.create({
    data: {
      ...data,
      organizationId: session.user.organizationId,
    },
    select: { id: true },
  });

  context.response.writeHead(302, {
    Location: `/organizations/${session.user.organizationId}/providers/${provider.id}`,
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
  providers: Provider[];
};

function Page({ session, providers }: Props) {
  return (
    <Layout title="Providers" session={session}>
      <h1>All providers</h1>

      <aside>
        <nav>
          <ul>
            <li>
              <a
                href={`/organizations/${session.user.organizationId}/providers/new`}
              >
                Create new provider
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {providers.length === 0 ? (
        <p>No providers found.</p>
      ) : (
        <ol>
          {providers.map(({ id, name }) => (
            <li key={id}>
              <a
                href={`/organizations/${session.user.organizationId}/providers/${id}`}
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
