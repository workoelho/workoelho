import { useId } from "react";

import { Layout } from "~/src/routes/public/layout";
import { HttpError } from "~/src/shared/error";
import type { Context } from "~/src/shared/handler";
import { render } from "~/src/shared/response";

export const constraint = "/organizations/new";

export async function handler(context: Context) {
	if (context.request.method !== "GET") {
		throw new HttpError(405);
	}

	render(context.response, <Page />);
}

// type Props = {};

function Page() {
	const organizationId = useId();
	const nameId = useId();
	const emailId = useId();
	const passwordId = useId();

	return (
		<Layout title="Sign up">
			<main>
				<form method="post" action="/organizations" className="stack">
					<fieldset>
						<legend className="title">Sign up</legend>

						<div>
							<label htmlFor={organizationId}>Organization:</label>
							<input
								id={organizationId}
								type="text"
								name="organization"
								required
							/>
						</div>

						<div>
							<label htmlFor={nameId}>Name:</label>
							<input id={nameId} type="name" name="name" required />
						</div>

						<div>
							<label htmlFor={emailId}>E-mail:</label>
							<input id={emailId} type="email" name="email" required />
						</div>

						<div>
							<label htmlFor={passwordId}>Password:</label>
							<input
								id={passwordId}
								type="password"
								name="password"
								required
								autoComplete="new-password"
							/>
						</div>
					</fieldset>

					<button type="submit">Sign up</button>
				</form>
			</main>
		</Layout>
	);
}
