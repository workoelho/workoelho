import { useId } from "react";

import { render } from "~/src/shared/response";
import { HttpError } from "~/src/shared/error";
import { Layout } from "~/src/routes/organization/layout";
import { Context } from "~/src/shared/handler";
import { Id, validate } from "~/src/shared/validation";
import { getSession } from "~/src/shared/session";
import { Organization, Session, User } from "~/src/shared/database";

export const url = "/organizations/:organizationId(\\d+)/users/new";

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

  render(context.response, <Page session={session} />);
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
};

function Page({ session }: Props) {
  const nameId = useId();
  const emailId = useId();

  return (
    <Layout title="New user" session={session}>
      <h1>Create new user</h1>

      <form
        method="POST"
        action={`/organizations/${session.user.organizationId}/users`}
      >
        <div>
          <label htmlFor={nameId}>Name:</label>
          <input id={nameId} type="name" name="name" required autoFocus />
        </div>

        <div>
          <label htmlFor={emailId}>E-mail:</label>
          <input id={emailId} type="email" name="email" required />
        </div>

        <button type="submit">Create user</button>
      </form>
    </Layout>
  );
}
