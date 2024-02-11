import { useId } from "react";

import { render } from "~/src/shared/response";
import { HttpError } from "~/src/shared/error";
import { Layout } from "~/src/routes/public/layout";
import { Context } from "~/src/shared/handler";

export const url = "/organizations/new";

// eslint-disable-next-line @typescript-eslint/require-await
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
          <legend className="title">Sign up</legend>

          <div>
            <label htmlFor={organizationId}>Organization:</label>
            <input
              id={organizationId}
              type="text"
              name="organization"
              required
              autoFocus
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

          <button type="submit">Sign up</button>
        </form>
      </main>
    </Layout>
  );
}
