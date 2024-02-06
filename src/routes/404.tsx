import { render } from "~/src/shared/response";
import { Layout } from "~/src/routes/layout";
import { Context } from "~/src/shared/handler";

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
