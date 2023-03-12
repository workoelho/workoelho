import { ReactNode } from "react";

type Props = {
  title?: string;
  children: ReactNode;
};

export default function Layout({ title, children }: Props) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title ? `${title} at Workoelho` : "Workoelho"}</title>

        <style></style>
      </head>
      <body>
        <nav>
          <ul>
            <li>
              <a href="/projects">All projects</a>
            </li>
            <li>
              <a href="/projects/1">Project #1</a>
            </li>
            <li>
              <a href="/projects/2">Project #2</a>
            </li>
            <li>
              <a href="/projects/3">Project #3</a>
            </li>
          </ul>
        </nav>

        {children}
      </body>
    </html>
  );
}
