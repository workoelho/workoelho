import { render } from "~/shared";
import Layout from "~/layout";
import { Context } from "~/types";

export const url = "/projects";

export async function handler(context: Context) {
  if (context.request.method !== "GET") {
    context.response.statusCode = 405;
    return;
  }

  context.response.statusCode = 200;
  context.response.setHeader("Content-Type", "text/html; charset=utf-8");
  context.response.end(
    render(
      <Layout>
        <h1>All projects</h1>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sapiente
          aperiam eaque necessitatibus illo impedit nulla minima nostrum
          inventore tempore. Ea placeat eaque architecto debitis dolor
          consectetur voluptatibus odio explicabo illo.
        </p>
      </Layout>
    )
  );
}
