import { render } from "~/shared";
import Layout from "~/layout";
import { Context } from "~/types";

export const statusCode = 500;

export async function handler(context: Context) {
  context.response.setHeader("Content-Type", "text/html; charset=utf-8");
  context.response.end(
    render(
      <Layout title="Error">
        <h1>Error</h1>
        <p>There was an error on our part. Try again later.</p>
      </Layout>
    )
  );
}
