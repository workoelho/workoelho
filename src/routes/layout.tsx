import { ReactNode } from "react";

type Props = {
  title?: string;
  children: ReactNode;
};

export function Layout({ title, children }: Props) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title ? `${title} — Workoelho` : "Workoelho"}</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
