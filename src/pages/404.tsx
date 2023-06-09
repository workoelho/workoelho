import { render } from "~/src/shared";
import Layout from "~/src/pages/layout";
import { Context } from "~/src/types";

export const statusCode = 404;

// eslint-disable-next-line @typescript-eslint/require-await
export async function handler(context: Context) {
  render(context.response, <Page url={context.url.pathname.input} />);
}

type Props = {
  url: string;
};

function Page({ url }: Props) {
  return (
    <Layout title="Not found">
      <h1>Not found</h1>
      <p>
        The path <code>{url}</code> didn't match any known routes.
      </p>
    </Layout>
  );
}
