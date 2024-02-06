import { ReactNode } from "react";

import { Organization } from "~/src/shared/database";
import { Layout as Root } from "~/src/routes/layout";

type Props = {
  title: string;
  organization: Organization;
  children: ReactNode;
};

export function Layout({ title, organization, children }: Props) {
  return (
    <Root title={`${title} at ${organization.name}`}>
      <nav>
        <h1>
          <a href="/">Workoelho</a>
        </h1>

        <ul>
          <li>
            <a href={`/organizations/${organization.id}/applications`}>
              All applications
            </a>
          </li>
          <li>
            <a href={`/organizations/${organization.id}/services`}>
              All services
            </a>
          </li>
          <li>
            <a href={`/organizations/${organization.id}/providers`}>
              All providers
            </a>
          </li>
        </ul>
      </nav>

      {children}
    </Root>
  );
}
