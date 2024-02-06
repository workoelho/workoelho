import { render } from "~/src/shared/response";
import { Layout } from "~/src/routes/public/layout";
import { Context } from "~/src/shared/handler";

export const statusCode = 400;

// eslint-disable-next-line @typescript-eslint/require-await
export async function handler(context: Context) {
  render(context.response, <Page />);
}

// type Props = {
//   url: string;
// };

function Page() {
  return (
    <Layout title="Bad request">
      <h1>Bad request</h1>
      <p>The request could not be understood.</p>
    </Layout>
  );
}
