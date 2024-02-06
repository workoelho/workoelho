import { useId } from "react";

import { render } from "~/src/shared/response";
import { HttpError } from "~/src/shared/error";
import Layout from "~/src/routes/layout";
import { Context } from "~/src/shared/handler";

export const url = "/projects/new";

// eslint-disable-next-line @typescript-eslint/require-await
export async function handler(context: Context) {
  if (context.request.method !== "GET") {
    throw new HttpError(405);
  }

  render(context.response, <Page />);
}

// type Props = {};

function Page() {
  const nameId = useId();
  const descriptionId = useId();

  return (
    <Layout>
      <h1>Create new project</h1>

      <form method="POST" action="/projects">
        <div>
          <label htmlFor={nameId}>Name:</label>
          <input id={nameId} type="text" name="name" required autoFocus />
        </div>

        <div>
          <label htmlFor={descriptionId}>Description:</label>
          <textarea id={descriptionId} name="description" required />
        </div>

        <button type="submit">Create project</button>
      </form>
    </Layout>
  );
}
