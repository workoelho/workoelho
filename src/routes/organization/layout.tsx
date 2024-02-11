import { ReactNode } from "react";

import { Organization, Session, User } from "~/src/shared/database";
import { Layout as Parent } from "~/src/routes/layout";
import { Button } from "~/src/components/Button";

type Props = {
  session: Session & { user: User & { organization: Organization } };
  title: string;
  children: ReactNode;
};

export function Layout({ title, session, children }: Props) {
  return (
    <Parent title={`${title} at ${session.user.organization.name}`}>
      <nav className="stack">
        <h1 style={{ fontWeight: "bold" }}>
          <a href="/">Workoelho</a>
        </h1>

        <ul>
          <li>
            <a
              href={`/organizations/${session.user.organization.id}/applications`}
            >
              Applications
            </a>
          </li>
          <li>
            <a href={`/organizations/${session.user.organization.id}/services`}>
              Services
            </a>
          </li>
          <li>
            <a
              href={`/organizations/${session.user.organization.id}/providers`}
            >
              Providers
            </a>
          </li>
          <li>
            <a href={`/organizations/${session.user.organization.id}/users`}>
              People
            </a>
          </li>
        </ul>

        <ul>
          <li>
            {session.user.name} ({session.user.organization.name})
          </li>
          <li>
            <Button method="post" action="/sessions?method=delete">
              Sign out
            </Button>
          </li>
        </ul>
      </nav>

      {children}
    </Parent>
  );
}
