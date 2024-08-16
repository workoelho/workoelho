import { Layout } from "~/src/routes/public/layout";
import type { Context } from "~/src/shared/handler";
import { render } from "~/src/shared/response";

export const constraint = 400;

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
