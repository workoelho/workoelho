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
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        <nav>
          <ul>
            <li>
              <a href="/">Not found</a>
            </li>
            <li>
              <a href="/projects">All projects</a>
            </li>
          </ul>
        </nav>

        {children}
      </body>
    </html>
  );
}
