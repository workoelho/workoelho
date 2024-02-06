import { render } from "~/src/shared/response";
import { Layout } from "~/src/routes/public/layout";
import { Context } from "~/src/shared/handler";

export const statusCode = 401;

// eslint-disable-next-line @typescript-eslint/require-await
export async function handler(context: Context) {
  render(context.response, <Page />);
}

// type Props = {
//   url: string;
// };

function Page() {
  return (
    <Layout title="Unauthorized">
      <h1>Unauthorized</h1>
      <p>
        Please try to <a href={`/sessions/new`}>sign in</a> again.
      </p>
    </Layout>
  );
}