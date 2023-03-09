import { Context, Id, render } from "~/shared";
import Layout from "~/layout";
import * as superstruct from "superstruct";

export const url = "/projects/:id";

export function handler(context: Context) {
  // @todo Need to be a helper.
  if (context.request.method !== "GET") {
    return { statusCode: 405 };
  }

  // @todo Need to be a helper.
  const { id: projectId } = superstruct.create(
    context.route.pathname.groups,
    superstruct.object({
      id: Id,
    })
  );

  if (projectId === undefined) {
    return { statusCode: 400 };
  }

  return {
    body: render(
      <Layout>
        <h1>Project #{projectId}</h1>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sapiente
          aperiam eaque necessitatibus illo impedit nulla minima nostrum
          inventore tempore. Ea placeat eaque architecto debitis dolor
          consectetur voluptatibus odio explicabo illo.
        </p>
      </Layout>
    ),
  };
}
