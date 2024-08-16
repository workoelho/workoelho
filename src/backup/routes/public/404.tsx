import { Layout } from "~/src/routes/public/layout";
import type { Context } from "~/src/shared/handler";
import { render } from "~/src/shared/response";

export const constraint = 404;

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
