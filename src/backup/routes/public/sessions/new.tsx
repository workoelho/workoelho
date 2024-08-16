import type { IncomingMessage, ServerResponse } from "node:http";
import { Field } from "~/src/components/Field";
import { Layout } from "~/src/routes/public/layout";
import { HttpError } from "~/src/shared/error";
import { getMethod } from "~/src/shared/request";
import { render } from "~/src/shared/response";

export async function handler(request: IncomingMessage, response: ServerResponse) {
	if (getMethod(request) !== "GET") {
		throw new HttpError(405);
	}

	render(response, <Page />);
}

function Page() {
	return (
		<Layout title="Sign in">
			<main>
				<form method="post" action="/sessions" className="stack">
					<fieldset className="stack" style={{ gap: ".75rem" }}>
						<legend className="title">Sign in</legend>

						<Field label="E-mail">
							{({ id }) => (
								<input
									className="input"
									id={id}
									type="email"
									name="email"
									required
								/>
							)}
						</Field>

						<Field label="Password">
							{({ id }) => (
								<input
									className="input"
									id={id}
									type="password"
									name="password"
									required
									autoComplete="current-password"
								/>
							)}
						</Field>
					</fieldset>

					<footer className="form-footer">
						<button type="submit" className="button">
							Sign in
						</button>
					</footer>
				</form>
			</main>
		</Layout>
	);
}
