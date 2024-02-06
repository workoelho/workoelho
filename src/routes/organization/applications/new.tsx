import { useId } from "react";

import { render } from "~/src/shared/response";
import { HttpError } from "~/src/shared/error";
import { Layout } from "~/src/routes/organization/layout";
import { Context } from "~/src/shared/handler";
import { Id, validate } from "~/src/shared/validation";

export const url = "/organizations/:id(\\d+)/applications/new";

// eslint-disable-next-line @typescript-eslint/require-await
export async function handler(context: Context) {
  if (context.request.method !== "GET") {
    throw new HttpError(405);
  }

  const { organizationId } = validate(context.url.pathname.groups, {
    applicationId: Id,
  });

  render(context.response, <Page />);
}

// type Props = {};

function Page() {
  const nameId = useId();
  const urlId = useId();

  return (
    <Layout>
      <h1>Create new application</h1>

      <form method="POST" action="/applications">
        <div>
          <label htmlFor={nameId}>Name:</label>
          <input id={nameId} type="text" name="name" required autoFocus />
        </div>

        <div>
          <label htmlFor={urlId}>URL:</label>
          <input id={urlId} type="url" name="url" required />
        </div>

        <button type="submit">Create application</button>
      </form>
    </Layout>
  );
}
