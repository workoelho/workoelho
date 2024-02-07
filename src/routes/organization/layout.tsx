import { ReactNode } from "react";

import { Organization, Session, User } from "~/src/shared/database";
import { Layout as Parent } from "~/src/routes/layout";

type Props = {
  session: Session & { user: User & { organization: Organization } };
  title: string;
  children: ReactNode;
};

export function Layout({ title, session, children }: Props) {
  return (
    <Parent title={`${title} at ${session.user.organization.name}`}>
      <nav>
        <h1>
          <a href="/">Workoelho</a>
        </h1>

        <ul>
          <li>
            <a
              href={`/organizations/${session.user.organization.id}/applications`}
            >
              All applications
            </a>
          </li>
          <li>
            <a href={`/organizations/${session.user.organization.id}/services`}>
              All services
            </a>
          </li>
          <li>
            <a
              href={`/organizations/${session.user.organization.id}/providers`}
            >
              All providers
            </a>
          </li>
        </ul>

        <ul>
          <li>
            {session.user.name} ({session.user.organization.name})
          </li>
          <li>
            <form method="post" action="/sessions?method=DELETE">
              <button type="submit">Sign out</button>
            </form>
          </li>
        </ul>
      </nav>

      {children}
    </Parent>
  );
}
