import { useId } from "react";

import { render } from "~/src/shared/response";
import { HttpError } from "~/src/shared/error";
import { Layout } from "~/src/routes/organization/layout";
import { Context } from "~/src/shared/handler";
import { Id, validate } from "~/src/shared/validation";
import { getSession } from "~/src/shared/session";
import { Organization, Session, User, database } from "~/src/shared/database";

export const url =
  "/organizations/:organizationId(\\d+)/users/:userId(\\d+)/edit";

export async function handleGet(context: Context) {
  const session = await getSession(context.request);

  if (!session) {
    throw new HttpError(401);
  }

  const { organizationId, userId } = validate(context.url.pathname.groups, {
    organizationId: Id,
    userId: Id,
  });

  if (organizationId !== session.user.organizationId) {
    throw new HttpError(401);
  }

  if (userId === null) {
    throw new HttpError(400);
  }

  const user = await database.user.findUnique({
    where: { organizationId: session.user.organizationId, id: userId },
  });

  if (!user) {
    throw new HttpError(404);
  }

  render(context.response, <Page session={session} user={user} />);
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
  user: User;
};

function Page({ session, user }: Props) {
  const nameId = useId();
  const emailId = useId();

  return (
    <Layout title="Edit user" session={session}>
      <h1>Edit user</h1>

      <form
        method="POST"
        action={`/organizations/${session.user.organizationId}/users/${user.id}?method=PATCH`}
      >
        <div>
          <label htmlFor={nameId}>Name:</label>
          <input
            id={nameId}
            type="name"
            name="name"
            value={user.name}
            required
            autoFocus
          />
        </div>

        <div>
          <label htmlFor={emailId}>E-mail:</label>
          <input
            id={emailId}
            type="email"
            name="email"
            value={user.email}
            required
          />
        </div>

        <button type="submit">Save user</button>
      </form>
    </Layout>
  );
}
