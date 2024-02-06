import { render } from "~/src/shared/response";
import Layout from "~/src/routes/layout";
import { Context } from "~/src/shared/handler";

export const statusCode = 500;

// eslint-disable-next-line @typescript-eslint/require-await
export async function handler(context: Context) {
  void render(context.response, <Page />);
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
