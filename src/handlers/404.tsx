import { Context, render } from "~/shared";
import Layout from "~/layout";

export const statusCode = 404;

export function handler(context: Context) {
  return {
    body: render(
      <Layout>
        <h1>Not found</h1>
        <p>
          The path <code>{context.url.pathname.input}</code> didn't match any
          known routes.
        </p>
      </Layout>
    ),
  };
}
