import { Layout } from "~/src/routes/public/layout";
import type { Context } from "~/src/shared/handler";
import { render } from "~/src/shared/response";
import { getUrl } from "~/src/shared/url";

export const constraint = 401;

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
				Please try to <a href={getUrl("sessions", "new")}>sign in</a> again.
			</p>
		</Layout>
	);
}
