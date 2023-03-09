import { Context, render } from "~/shared";
import Layout from "~/layout";

export const url = "/projects";

export function handler(context: Context) {
  if (context.request.method !== "GET") {
    return { statusCode: 405 };
  }

  return {
    body: render(
      <Layout>
        <h1>All project</h1>
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
