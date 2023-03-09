import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Layout(props: Props) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Workoelho</title>
      </head>
      <body>{props.children}</body>
    </html>
  );
}
