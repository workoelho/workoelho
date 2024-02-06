import { useId } from "react";

import { render } from "~/src/shared/response";
import { HttpError } from "~/src/shared/error";
import { Layout } from "~/src/routes/layout";
import { Context } from "~/src/shared/handler";

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
  const emailId = useId();
  const passwordId = useId();

  return (
    <Layout title="Sign-in">
      <h1>Sign-in</h1>

      <form method="POST" action="/sessions">
        <div>
          <label htmlFor={emailId}>E-mail:</label>
          <input id={emailId} type="email" name="email" required autoFocus />
        </div>

        <div>
          <label htmlFor={passwordId}>Password:</label>
          <input id={passwordId} type="password" name="password" required />
        </div>

        <button type="submit">Sign-in</button>
      </form>
    </Layout>
  );
}
