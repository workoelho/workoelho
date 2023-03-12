import { Context, render } from "~/shared";
import Layout from "~/layout";

export const statusCode = 500;

export function handler(context: Context) {
  return {
    body: render(
      <Layout>
        <h1>Error</h1>
        <p>There was an error on our part. Try again later.</p>
      </Layout>
    ),
  };
}
