import { render } from "~/src/shared/response";
import { HttpError } from "~/src/shared/error";
import { Layout } from "~/src/routes/organization/layout";
import { Context } from "~/src/shared/handler";
import { Id, validate } from "~/src/shared/validation";
import { getSession } from "~/src/shared/session";
import { Organization, Session, User } from "~/src/shared/database";
import { Field } from "~/src/components/Field";

export const url = "/organizations/:organizationId(\\d+)/applications/new";

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
  return (
    <Layout title="New application" session={session}>
      <main className="stack">
        <form
          method="post"
          action={`/organizations/${session.user.organizationId}/applications`}
        >
          <legend className="title">Create new application</legend>

          <Field label="Name">
            {({ id }) => (
              <input id={id} type="text" name="name" required autoFocus />
            )}
          </Field>

          <Field label="URL">
            {({ id }) => <input id={id} type="url" name="url" required />}
          </Field>

          <button className="button">Create application</button>
        </form>
      </main>
    </Layout>
  );
}
