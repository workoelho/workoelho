import { Layout } from "~/src/routes/public/layout";
import type { Context } from "~/src/shared/handler";
import { render } from "~/src/shared/response";

export const constraint = 500;

export async function handler(context: Context) {
	void render(context.response, <Page />);
}

// type Props = {};

function Page() {
	return (
		<Layout title="Unexpected error">
			<h1>Unexpected error</h1>
			<p>There was an error on our part. Try again later.</p>
		</Layout>
	);
}
