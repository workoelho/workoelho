import { useId } from "react";

import Layout from "~/layout";
import { HttpError, render } from "~/shared";
import type { Context } from "~/types";

export const url = "/projects/new";

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
