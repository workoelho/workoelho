import { render } from "~/shared";
import Layout from "~/layout";
import { Context } from "~/types";

export const statusCode = 404;

export async function handler(context: Context) {
  context.response.setHeader("Content-Type", "text/html; charset=utf-8");
  context.response.end(
    render(
      <Layout title="Not found">
        <h1>Not found</h1>
        <p>
          The path <code>{context.url.pathname.input}</code> didn't match any
          known routes.
        </p>
      </Layout>
    )
  );
}
