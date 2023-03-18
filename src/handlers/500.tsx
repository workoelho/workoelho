import { render } from "~/shared";
import Layout from "~/layout";
import { Context } from "~/types";

export const statusCode = 500;

export async function handler(context: Context) {
  render(context.response, <Page />);
}

// type Props = {};

function Page() {
  return (
    <Layout title="Error">
      <h1>Error</h1>
      <p>There was an error on our part. Try again later.</p>
    </Layout>
  );
}
