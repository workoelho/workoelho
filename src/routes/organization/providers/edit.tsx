import { useId } from "react";

import { render } from "~/src/shared/response";
import { HttpError } from "~/src/shared/error";
import { Layout } from "~/src/routes/organization/layout";
import { Context } from "~/src/shared/handler";
import { Id, validate } from "~/src/shared/validation";
import { getSession } from "~/src/shared/session";
import {
  Provider,
  Organization,
  Session,
  User,
  database,
} from "~/src/shared/database";

export const url =
  "/organizations/:organizationId(\\d+)/providers/:providerId(\\d+)/edit";

export async function handleGet(context: Context) {
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
  provider: Provider;
};

function Page({ session, provider }: Props) {
  const nameId = useId();
  const urlId = useId();

  return (
    <Layout title="Edit provider" session={session}>
      <h1>Edit provider</h1>

      <form
        method="POST"
        action={`/organizations/${session.user.organizationId}/providers/${provider.id}?method=PATCH`}
      >
        <div>
          <label htmlFor={nameId}>Name:</label>
          <input
            id={nameId}
            type="text"
            name="name"
            value={provider.name}
            required
            autoFocus
          />
        </div>

        <div>
          <label htmlFor={urlId}>URL:</label>
          <input
            id={urlId}
            type="url"
            name="url"
            value={provider.url}
            required
          />
        </div>

        <button type="submit">Save provider</button>
      </form>
    </Layout>
  );
}
