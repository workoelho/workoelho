import { ReactNode } from "react";

import { Layout as Root } from "~/src/routes/layout";

type Props = {
  title?: string;
  children: ReactNode;
};

export function Layout({ title, children }: Props) {
  return (
    <Root title={title}>
      <nav>
        <h1>
          <a href="/">Workoelho</a>
        </h1>

        <ul>
          <li>
            <a href="/sessions/new">Sign-in</a>
          </li>
        </ul>
      </nav>

      <main>{children}</main>
    </Root>
  );
}
