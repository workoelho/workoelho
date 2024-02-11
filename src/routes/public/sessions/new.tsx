import { render } from "~/src/shared/response";
import { HttpError } from "~/src/shared/error";
import { Layout } from "~/src/routes/public/layout";
import { Context } from "~/src/shared/handler";
import { Field } from "~/src/components/Field";

export const url = "/sessions/new";

// eslint-disable-next-line @typescript-eslint/require-await
export async function handler(context: Context) {
  if (context.request.method !== "GET") {
    throw new HttpError(405);
  }

  render(context.response, <Page />);
}

// type Props = {};

function Page() {
  return (
    <Layout title="Sign in">
      <main>
        <form method="post" action="/sessions" className="stack">
          <legend className="title">Sign in</legend>

          <fieldset className="stack" style={{ gap: ".75rem" }}>
            <Field label="E-mail">
              {({ id }) => (
                <input
                  className="input"
                  id={id}
                  type="email"
                  name="email"
                  required
                  autoFocus
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
            <button className="button">Sign in</button>
          </footer>
        </form>
      </main>
    </Layout>
  );
}
